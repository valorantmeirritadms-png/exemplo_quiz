"""
Quiz Colômbia - Backend API
Servidor FastAPI com autenticação JWT e sistema de quiz

Alterações realizadas:
- Adicionado sistema de ranking global
- Perguntas agora incluem curiosidades para feedback enriquecido
- Endpoint para salvar e buscar rankings
- Shuffle de perguntas no endpoint
"""

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
import bcrypt
import jwt
import secrets
import random
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

# ============================================
# CONFIGURAÇÃO DO MONGODB
# Conexão com a base de dados
# ============================================
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ============================================
# CONFIGURAÇÃO JWT
# Funções para autenticação e tokens
# ============================================
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    """Retorna a chave secreta JWT do ambiente"""
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    """Encripta a password usando bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a password corresponde ao hash"""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    """Cria um token de acesso JWT (válido por 15 minutos)"""
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    """Cria um token de refresh JWT (válido por 7 dias)"""
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    """
    Middleware para obter o utilizador atual a partir do token JWT
    Verifica cookies primeiro, depois header Authorization
    """
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============================================
# CRIAÇÃO DA APP FASTAPI
# ============================================
app = FastAPI(title="Quiz Colômbia API", version="2.0")
api_router = APIRouter(prefix="/api")

# ============================================
# MODELOS PYDANTIC
# Schemas para validação de dados
# ============================================
class UserRegister(BaseModel):
    """Modelo para registo de utilizador"""
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    """Modelo para login de utilizador"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """Modelo de resposta do utilizador"""
    id: str
    name: str
    email: str
    role: str = "user"

class QuestionResponse(BaseModel):
    """Modelo de resposta de pergunta"""
    id: int
    pergunta: str
    opcoes: List[str]

class AnswerSubmit(BaseModel):
    """Modelo para submissão de resposta"""
    question_id: int
    answer: str

class ScoreSubmit(BaseModel):
    """Modelo para submissão de pontuação no ranking"""
    level: int
    score: int
    total: int

# ============================================
# DADOS DO QUIZ
# 50 perguntas distribuídas em 5 níveis
# ALTERAÇÃO: Adicionadas curiosidades para cada pergunta
# ============================================
QUIZ_DATA = {
    1: {
        "tema": "Cantores",
        "tema_es": "Cantantes",
        "perguntas": [
            {
                "id": 1, 
                "pergunta": "Quem é a cantora colombiana famosa pela música 'Hips Don't Lie'?",
                "pergunta_es": "¿Quién es la cantante colombiana famosa por la canción 'Hips Don't Lie'?",
                "opcoes": ["Karol G", "Shakira", "Becky G", "Rosalía"],
                "correta": "Shakira",
                "curiosidade": "Shakira Isabel Mebarak Ripoll nasceu em Barranquilla em 1977. Ela fala fluentemente espanhol, inglês, português, italiano e árabe!",
                "curiosidade_es": "Shakira Isabel Mebarak Ripoll nació en Barranquilla en 1977. ¡Habla con fluidez español, inglés, portugués, italiano y árabe!"
            },
            {
                "id": 2,
                "pergunta": "Qual destes artistas é conhecido pelo reggaeton?",
                "pergunta_es": "¿Cuál de estos artistas es conocido por el reggaetón?",
                "opcoes": ["Juanes", "J Balvin", "Carlos Vives", "Fonseca"],
                "correta": "J Balvin",
                "curiosidade": "J Balvin é de Medellín e é conhecido como o 'Príncipe do Reggaeton'. Seu nome real é José Álvaro Osorio Balvín.",
                "curiosidade_es": "J Balvin es de Medellín y es conocido como el 'Príncipe del Reggaetón'. Su nombre real es José Álvaro Osorio Balvín."
            },
            {
                "id": 3,
                "pergunta": "Quem canta 'La Bicicleta' junto com Shakira?",
                "pergunta_es": "¿Quién canta 'La Bicicleta' junto con Shakira?",
                "opcoes": ["Maluma", "Carlos Vives", "J Balvin", "Daddy Yankee"],
                "correta": "Carlos Vives",
                "curiosidade": "Carlos Vives é considerado o pai do vallenato moderno. A música 'La Bicicleta' ganhou 2 Grammy Latinos em 2016!",
                "curiosidade_es": "Carlos Vives es considerado el padre del vallenato moderno. ¡La canción 'La Bicicleta' ganó 2 Grammy Latinos en 2016!"
            },
            {
                "id": 4,
                "pergunta": "Qual cantor colombiano é famoso pela música 'Felices los 4'?",
                "pergunta_es": "¿Qué cantante colombiano es famoso por la canción 'Felices los 4'?",
                "opcoes": ["Maluma", "Nicky Jam", "Ozuna", "Bad Bunny"],
                "correta": "Maluma",
                "curiosidade": "Maluma é o nome artístico de Juan Luis Londoño Arias. O nome vem das primeiras sílabas dos nomes da sua mãe (Marlli), pai (Luis) e irmã (Manuela).",
                "curiosidade_es": "Maluma es el nombre artístico de Juan Luis Londoño Arias. El nombre viene de las primeras sílabas de los nombres de su madre (Marlli), padre (Luis) y hermana (Manuela)."
            },
            {
                "id": 5,
                "pergunta": "Quem é conhecida como 'La Bichota'?",
                "pergunta_es": "¿Quién es conocida como 'La Bichota'?",
                "opcoes": ["Shakira", "Karol G", "Anitta", "Natti Natasha"],
                "correta": "Karol G",
                "curiosidade": "Karol G é de Medellín e seu verdadeiro nome é Carolina Giraldo Navarro. Ela estudou música na Universidade de Antioquia.",
                "curiosidade_es": "Karol G es de Medellín y su nombre real es Carolina Giraldo Navarro. Estudió música en la Universidad de Antioquia."
            },
            {
                "id": 6,
                "pergunta": "Qual artista colombiano ganhou vários Grammy Latinos com rock em espanhol?",
                "pergunta_es": "¿Qué artista colombiano ganó varios Grammy Latinos con rock en español?",
                "opcoes": ["Juanes", "Fonseca", "Silvestre Dangond", "Diomedes Díaz"],
                "correta": "Juanes",
                "curiosidade": "Juanes tem 28 Grammy Latinos, sendo um dos artistas mais premiados da história! Seu nome real é Juan Esteban Aristizábal Vásquez.",
                "curiosidade_es": "¡Juanes tiene 28 Grammy Latinos, siendo uno de los artistas más premiados de la historia! Su nombre real es Juan Esteban Aristizábal Vásquez."
            },
            {
                "id": 7,
                "pergunta": "Quem canta 'Mi Gente' junto com J Balvin?",
                "pergunta_es": "¿Quién canta 'Mi Gente' junto con J Balvin?",
                "opcoes": ["Willy William", "Daddy Yankee", "Bad Bunny", "Nicky Jam"],
                "correta": "Willy William",
                "curiosidade": "'Mi Gente' foi a primeira música em espanhol a alcançar o #1 no Spotify Global! Beyoncé fez um remix da música.",
                "curiosidade_es": "¡'Mi Gente' fue la primera canción en español en alcanzar el #1 en Spotify Global! Beyoncé hizo un remix de la canción."
            },
            {
                "id": 8,
                "pergunta": "Qual é o nome artístico de Édgar Rentería no mundo da música?",
                "pergunta_es": "¿Cuál es el nombre artístico de Édgar Rentería en el mundo de la música?",
                "opcoes": ["Fonseca", "Pipe Bueno", "Ryan Castro", "Blessd"],
                "correta": "Fonseca",
                "curiosidade": "Fonseca (Juan Fernando Fonseca) é um cantor, compositor e produtor de Bogotá. É casado com a atriz Juliana Restrepo.",
                "curiosidade_es": "Fonseca (Juan Fernando Fonseca) es un cantante, compositor y productor de Bogotá. Está casado con la actriz Juliana Restrepo."
            },
            {
                "id": 9,
                "pergunta": "Quem é o 'Rey del Vallenato' mais famoso da Colômbia?",
                "pergunta_es": "¿Quién es el 'Rey del Vallenato' más famoso de Colombia?",
                "opcoes": ["Carlos Vives", "Diomedes Díaz", "Silvestre Dangond", "Jorge Celedón"],
                "correta": "Diomedes Díaz",
                "curiosidade": "Diomedes Díaz era conhecido como 'El Cacique de La Junta'. Gravou mais de 30 álbuns e é considerado uma lenda do vallenato.",
                "curiosidade_es": "Diomedes Díaz era conocido como 'El Cacique de La Junta'. Grabó más de 30 álbumes y es considerado una leyenda del vallenato."
            },
            {
                "id": 10,
                "pergunta": "Qual cantora colombiana é famosa por 'Tusa'?",
                "pergunta_es": "¿Qué cantante colombiana es famosa por 'Tusa'?",
                "opcoes": ["Shakira", "Karol G", "Fanny Lu", "Greeicy"],
                "correta": "Karol G",
                "curiosidade": "'Tusa' com Nicki Minaj foi #1 em 20 países e passou 25 semanas no top 10 do Billboard Hot Latin Songs!",
                "curiosidade_es": "¡'Tusa' con Nicki Minaj fue #1 en 20 países y pasó 25 semanas en el top 10 del Billboard Hot Latin Songs!"
            }
        ]
    },
    2: {
        "tema": "Cultura",
        "tema_es": "Cultura",
        "perguntas": [
            {
                "id": 11,
                "pergunta": "Qual é a dança tradicional mais famosa da Colômbia?",
                "pergunta_es": "¿Cuál es el baile tradicional más famoso de Colombia?",
                "opcoes": ["Salsa", "Cumbia", "Tango", "Flamenco"],
                "correta": "Cumbia",
                "curiosidade": "A Cumbia nasceu na costa caribenha colombiana e é uma mistura de ritmos africanos, indígenas e espanhóis. É Patrimônio Cultural da Nação!",
                "curiosidade_es": "¡La Cumbia nació en la costa caribeña colombiana y es una mezcla de ritmos africanos, indígenas y españoles. Es Patrimonio Cultural de la Nación!"
            },
            {
                "id": 12,
                "pergunta": "Qual é a língua oficial da Colômbia?",
                "pergunta_es": "¿Cuál es el idioma oficial de Colombia?",
                "opcoes": ["Português", "Espanhol", "Inglês", "Francês"],
                "correta": "Espanhol",
                "curiosidade": "Além do espanhol, a Colômbia reconhece 68 línguas indígenas como oficiais em seus territórios! O país tem uma grande diversidade linguística.",
                "curiosidade_es": "¡Además del español, Colombia reconoce 68 lenguas indígenas como oficiales en sus territorios! El país tiene una gran diversidad lingüística."
            },
            {
                "id": 13,
                "pergunta": "Qual é o chapéu tradicional colombiano?",
                "pergunta_es": "¿Cuál es el sombrero tradicional colombiano?",
                "opcoes": ["Fedora", "Sombrero vueltiao", "Panama", "Cowboy"],
                "correta": "Sombrero vueltiao",
                "curiosidade": "O Sombrero Vueltiao é feito de fibra de cana flecha e pode levar até 1 mês para ser feito à mão! É símbolo nacional da Colômbia.",
                "curiosidade_es": "¡El Sombrero Vueltiao está hecho de fibra de caña flecha y puede tomar hasta 1 mes hacerlo a mano! Es símbolo nacional de Colombia."
            },
            {
                "id": 14,
                "pergunta": "Qual festival é o mais famoso de Barranquilla?",
                "pergunta_es": "¿Cuál festival es el más famoso de Barranquilla?",
                "opcoes": ["Festival de Cali", "Carnaval de Barranquilla", "Feria de las Flores", "Festival Vallenato"],
                "correta": "Carnaval de Barranquilla",
                "curiosidade": "O Carnaval de Barranquilla é o segundo maior do mundo, só perde para o Rio de Janeiro! É Patrimônio da Humanidade pela UNESCO.",
                "curiosidade_es": "¡El Carnaval de Barranquilla es el segundo más grande del mundo, solo superado por Río de Janeiro! Es Patrimonio de la Humanidad por la UNESCO."
            },
            {
                "id": 15,
                "pergunta": "Qual é a flor nacional da Colômbia?",
                "pergunta_es": "¿Cuál es la flor nacional de Colombia?",
                "opcoes": ["Rosa", "Orquídea", "Girassol", "Tulipa"],
                "correta": "Orquídea",
                "curiosidade": "A Colômbia tem mais de 4.000 espécies de orquídeas, mais do que qualquer outro país! A Cattleya trianae é a orquídea nacional.",
                "curiosidade_es": "¡Colombia tiene más de 4.000 especies de orquídeas, más que cualquier otro país! La Cattleya trianae es la orquídea nacional."
            },
            {
                "id": 16,
                "pergunta": "Qual escritor colombiano ganhou o Prémio Nobel de Literatura?",
                "pergunta_es": "¿Qué escritor colombiano ganó el Premio Nobel de Literatura?",
                "opcoes": ["Pablo Neruda", "Gabriel García Márquez", "Mario Vargas Llosa", "Jorge Luis Borges"],
                "correta": "Gabriel García Márquez",
                "curiosidade": "'Gabo' ganhou o Nobel em 1982. Seu livro 'Cem Anos de Solidão' vendeu mais de 50 milhões de cópias em 46 idiomas!",
                "curiosidade_es": "¡'Gabo' ganó el Nobel en 1982. Su libro 'Cien Años de Soledad' vendió más de 50 millones de copias en 46 idiomas!"
            },
            {
                "id": 17,
                "pergunta": "Qual é o instrumento típico do vallenato?",
                "pergunta_es": "¿Cuál es el instrumento típico del vallenato?",
                "opcoes": ["Guitarra", "Acordeão", "Piano", "Flauta"],
                "correta": "Acordeão",
                "curiosidade": "O vallenato usa 3 instrumentos principais: acordeão, caja (tambor) e guacharaca. O acordeão chegou à Colômbia por marinheiros alemães no séc. XIX!",
                "curiosidade_es": "¡El vallenato usa 3 instrumentos principales: acordeón, caja y guacharaca. El acordeón llegó a Colombia por marineros alemanes en el siglo XIX!"
            },
            {
                "id": 18,
                "pergunta": "Qual cidade é conhecida como a 'capital da salsa'?",
                "pergunta_es": "¿Qué ciudad es conocida como la 'capital de la salsa'?",
                "opcoes": ["Bogotá", "Medellín", "Cali", "Cartagena"],
                "correta": "Cali",
                "curiosidade": "Cali tem mais de 100 escolas de salsa e realiza o maior festival de salsa do mundo! A cidade respira este ritmo 24 horas por dia.",
                "curiosidade_es": "¡Cali tiene más de 100 escuelas de salsa y realiza el festival de salsa más grande del mundo! La ciudad respira este ritmo 24 horas al día."
            },
            {
                "id": 19,
                "pergunta": "Qual é o livro mais famoso de García Márquez?",
                "pergunta_es": "¿Cuál es el libro más famoso de García Márquez?",
                "opcoes": ["Dom Quixote", "Cem Anos de Solidão", "O Alquimista", "1984"],
                "correta": "Cem Anos de Solidão",
                "curiosidade": "García Márquez escreveu 'Cem Anos de Solidão' em 18 meses, trabalhando 8 horas por dia. Sua esposa vendeu eletrodomésticos para pagar as contas!",
                "curiosidade_es": "¡García Márquez escribió 'Cien Años de Soledad' en 18 meses, trabajando 8 horas por día. Su esposa vendió electrodomésticos para pagar las cuentas!"
            },
            {
                "id": 20,
                "pergunta": "Qual é o desporto mais popular na Colômbia?",
                "pergunta_es": "¿Cuál es el deporte más popular en Colombia?",
                "opcoes": ["Basquete", "Futebol", "Basebol", "Ténis"],
                "correta": "Futebol",
                "curiosidade": "A Colômbia tem grandes jogadores como Carlos Valderrama, James Rodríguez e Radamel Falcao. O país sediou a Copa América em 2001!",
                "curiosidade_es": "¡Colombia tiene grandes jugadores como Carlos Valderrama, James Rodríguez y Radamel Falcao. El país fue sede de la Copa América en 2001!"
            }
        ]
    },
    3: {
        "tema": "Gastronomia",
        "tema_es": "Gastronomía",
        "perguntas": [
            {
                "id": 21,
                "pergunta": "Qual é um prato típico feito de milho?",
                "pergunta_es": "¿Cuál es un plato típico hecho de maíz?",
                "opcoes": ["Taco", "Arepa", "Pizza", "Hambúrguer"],
                "correta": "Arepa",
                "curiosidade": "A arepa tem mais de 3.000 anos de história! Existem mais de 75 tipos diferentes de arepas na Colômbia, cada região tem a sua versão.",
                "curiosidade_es": "¡La arepa tiene más de 3.000 años de historia! Existen más de 75 tipos diferentes de arepas en Colombia, cada región tiene su versión."
            },
            {
                "id": 22,
                "pergunta": "O que é 'Bandeja Paisa'?",
                "pergunta_es": "¿Qué es 'Bandeja Paisa'?",
                "opcoes": ["Uma bebida", "Uma sobremesa", "Um prato típico", "Uma dança"],
                "correta": "Um prato típico",
                "curiosidade": "A Bandeja Paisa tem cerca de 1.500 calorias! Inclui feijão, arroz, carne moída, chicharrón, ovo, arepa, banana e muito mais.",
                "curiosidade_es": "¡La Bandeja Paisa tiene cerca de 1.500 calorías! Incluye frijoles, arroz, carne molida, chicharrón, huevo, arepa, plátano y mucho más."
            },
            {
                "id": 23,
                "pergunta": "Qual bebida colombiana é feita com panela?",
                "pergunta_es": "¿Qué bebida colombiana está hecha con panela?",
                "opcoes": ["Café", "Aguapanela", "Cerveja", "Rum"],
                "correta": "Aguapanela",
                "curiosidade": "A panela é açúcar de cana não refinado. A Colômbia é o segundo maior produtor de panela do mundo! Aguapanela é servida quente ou fria.",
                "curiosidade_es": "¡La panela es azúcar de caña sin refinar. Colombia es el segundo mayor productor de panela del mundo! La aguapanela se sirve caliente o fría."
            },
            {
                "id": 24,
                "pergunta": "Qual é a fruta colombiana conhecida por seu sabor ácido?",
                "pergunta_es": "¿Cuál es la fruta colombiana conocida por su sabor ácido?",
                "opcoes": ["Banana", "Lulo", "Maçã", "Uva"],
                "correta": "Lulo",
                "curiosidade": "O lulo é conhecido como 'naranjilla' em outros países. É usado para fazer sucos, sorvetes e até cocktails! É rico em vitamina C.",
                "curiosidade_es": "¡El lulo es conocido como 'naranjilla' en otros países. Se usa para hacer jugos, helados y hasta cócteles! Es rico en vitamina C."
            },
            {
                "id": 25,
                "pergunta": "O que é 'Ajiaco'?",
                "pergunta_es": "¿Qué es 'Ajiaco'?",
                "opcoes": ["Um prato de peixe", "Uma sopa típica de Bogotá", "Uma sobremesa", "Um tipo de carne"],
                "correta": "Uma sopa típica de Bogotá",
                "curiosidade": "O Ajiaco leva 3 tipos de batata diferentes! É servido com frango, milho, alcaparras, creme de leite e abacate. Perfeito para o frio de Bogotá!",
                "curiosidade_es": "¡El Ajiaco lleva 3 tipos de papa diferentes! Se sirve con pollo, maíz, alcaparras, crema de leche y aguacate. ¡Perfecto para el frío de Bogotá!"
            },
            {
                "id": 26,
                "pergunta": "Qual café é famoso mundialmente por sua qualidade?",
                "pergunta_es": "¿Qué café es mundialmente famoso por su calidad?",
                "opcoes": ["Café Brasileiro", "Café Colombiano", "Café Italiano", "Café Turco"],
                "correta": "Café Colombiano",
                "curiosidade": "A Colômbia é o terceiro maior produtor de café do mundo! O café colombiano é 100% Arábica e é cultivado entre 1.200 e 1.800 metros de altitude.",
                "curiosidade_es": "¡Colombia es el tercer mayor productor de café del mundo! El café colombiano es 100% Arábica y se cultiva entre 1.200 y 1.800 metros de altitud."
            },
            {
                "id": 27,
                "pergunta": "O que são 'empanadas' colombianas?",
                "pergunta_es": "¿Qué son las 'empanadas' colombianas?",
                "opcoes": ["Doces", "Pastéis fritos recheados", "Bebidas", "Sopas"],
                "correta": "Pastéis fritos recheados",
                "curiosidade": "As empanadas colombianas são feitas com massa de milho e recheadas com carne e batata. Cada colombiano come em média 12 empanadas por semana!",
                "curiosidade_es": "¡Las empanadas colombianas están hechas con masa de maíz y rellenas de carne y papa. Cada colombiano come en promedio 12 empanadas por semana!"
            },
            {
                "id": 28,
                "pergunta": "Qual é a bebida alcoólica típica da Colômbia?",
                "pergunta_es": "¿Cuál es la bebida alcohólica típica de Colombia?",
                "opcoes": ["Tequila", "Aguardiente", "Cachaça", "Whisky"],
                "correta": "Aguardiente",
                "curiosidade": "O Aguardiente colombiano tem sabor de anis e tem cerca de 29% de álcool. Cada região tem sua marca preferida: Antioqueño, Néctar, Cristal...",
                "curiosidade_es": "¡El Aguardiente colombiano tiene sabor a anís y tiene cerca del 29% de alcohol. Cada región tiene su marca preferida: Antioqueño, Néctar, Cristal..."
            },
            {
                "id": 29,
                "pergunta": "O que é 'Sancocho'?",
                "pergunta_es": "¿Qué es 'Sancocho'?",
                "opcoes": ["Uma salada", "Uma sopa com carnes e legumes", "Uma sobremesa", "Um pão"],
                "correta": "Uma sopa com carnes e legumes",
                "curiosidade": "O Sancocho é o prato perfeito para a ressaca! Pode levar frango, carne ou peixe. É tradicionalmente feito em festas e reuniões familiares.",
                "curiosidade_es": "¡El Sancocho es el plato perfecto para la resaca! Puede llevar pollo, carne o pescado. Se hace tradicionalmente en fiestas y reuniones familiares."
            },
            {
                "id": 30,
                "pergunta": "Qual região colombiana é famosa pelo café?",
                "pergunta_es": "¿Qué región colombiana es famosa por el café?",
                "opcoes": ["Costa Caribe", "Eje Cafetero", "Amazônia", "Los Llanos"],
                "correta": "Eje Cafetero",
                "curiosidade": "O Eje Cafetero inclui Caldas, Risaralda e Quindío. A região é Patrimônio da Humanidade pela UNESCO desde 2011!",
                "curiosidade_es": "¡El Eje Cafetero incluye Caldas, Risaralda y Quindío. La región es Patrimonio de la Humanidad por la UNESCO desde 2011!"
            }
        ]
    },
    4: {
        "tema": "História",
        "tema_es": "Historia",
        "perguntas": [
            {
                "id": 31,
                "pergunta": "Em que ano começou a independência da Colômbia?",
                "pergunta_es": "¿En qué año comenzó la independencia de Colombia?",
                "opcoes": ["1810", "1492", "1900", "1700"],
                "correta": "1810",
                "curiosidade": "O 'Grito de Independência' aconteceu em 20 de julho de 1810 em Bogotá, quando colonos confrontaram autoridades espanholas pedindo um vaso emprestado!",
                "curiosidade_es": "¡El 'Grito de Independencia' ocurrió el 20 de julio de 1810 en Bogotá, cuando colonos confrontaron autoridades españolas pidiendo un florero prestado!"
            },
            {
                "id": 32,
                "pergunta": "Quem foi Simón Bolívar?",
                "pergunta_es": "¿Quién fue Simón Bolívar?",
                "opcoes": ["Cantor", "Libertador", "Ator", "Jogador"],
                "correta": "Libertador",
                "curiosidade": "Simón Bolívar libertou 6 países: Venezuela, Colômbia, Equador, Peru, Bolívia e Panamá! É chamado de 'El Libertador' em toda a América Latina.",
                "curiosidade_es": "¡Simón Bolívar libertó 6 países: Venezuela, Colombia, Ecuador, Perú, Bolivia y Panamá! Es llamado 'El Libertador' en toda América Latina."
            },
            {
                "id": 33,
                "pergunta": "Qual civilização indígena habitou a Colômbia?",
                "pergunta_es": "¿Qué civilización indígena habitó Colombia?",
                "opcoes": ["Maias", "Muiscas", "Incas", "Astecas"],
                "correta": "Muiscas",
                "curiosidade": "Os Muiscas criaram a lenda de El Dorado! Eles jogavam ouro e esmeraldas na Lagoa Guatavita como oferenda aos deuses.",
                "curiosidade_es": "¡Los Muiscas crearon la leyenda de El Dorado! Lanzaban oro y esmeraldas en la Laguna de Guatavita como ofrenda a los dioses."
            },
            {
                "id": 34,
                "pergunta": "Qual país colonizou a Colômbia?",
                "pergunta_es": "¿Qué país colonizó Colombia?",
                "opcoes": ["Portugal", "Espanha", "França", "Inglaterra"],
                "correta": "Espanha",
                "curiosidade": "A colonização espanhola durou cerca de 300 anos (1499-1819). Cartagena foi o principal porto de chegada de escravos africanos nas Américas.",
                "curiosidade_es": "¡La colonización española duró cerca de 300 años (1499-1819). Cartagena fue el principal puerto de llegada de esclavos africanos en las Américas."
            },
            {
                "id": 35,
                "pergunta": "Qual era o nome da Colômbia antes da independência?",
                "pergunta_es": "¿Cuál era el nombre de Colombia antes de la independencia?",
                "opcoes": ["Nueva Granada", "Perú", "Venezuela", "México"],
                "correta": "Nueva Granada",
                "curiosidade": "O Virreinato de Nueva Granada incluía os territórios atuais da Colômbia, Equador, Venezuela e Panamá! A capital era Santa Fe de Bogotá.",
                "curiosidade_es": "¡El Virreinato de Nueva Granada incluía los territorios actuales de Colombia, Ecuador, Venezuela y Panamá! La capital era Santa Fe de Bogotá."
            },
            {
                "id": 36,
                "pergunta": "Quem foi Antonio Nariño?",
                "pergunta_es": "¿Quién fue Antonio Nariño?",
                "opcoes": ["Um pintor", "Um prócer da independência", "Um cantor", "Um chef"],
                "correta": "Um prócer da independência",
                "curiosidade": "Antonio Nariño traduziu a Declaração dos Direitos do Homem para o espanhol e foi preso por isso! Ele é considerado o precursor da independência colombiana.",
                "curiosidade_es": "¡Antonio Nariño tradujo la Declaración de los Derechos del Hombre al español y fue encarcelado por eso! Es considerado el precursor de la independencia colombiana."
            },
            {
                "id": 37,
                "pergunta": "Qual é a data da independência da Colômbia?",
                "pergunta_es": "¿Cuál es la fecha de independencia de Colombia?",
                "opcoes": ["7 de agosto", "20 de julho", "15 de setembro", "12 de outubro"],
                "correta": "20 de julho",
                "curiosidade": "O 20 de julho é feriado nacional na Colômbia! Mas a independência total só foi conquistada em 7 de agosto de 1819, na Batalha de Boyacá.",
                "curiosidade_es": "¡El 20 de julio es feriado nacional en Colombia! Pero la independencia total solo se logró el 7 de agosto de 1819, en la Batalla de Boyacá."
            },
            {
                "id": 38,
                "pergunta": "O que foi a 'Gran Colombia'?",
                "pergunta_es": "¿Qué fue la 'Gran Colombia'?",
                "opcoes": ["Uma cidade", "Uma união de países", "Um rio", "Uma montanha"],
                "correta": "Uma união de países",
                "curiosidade": "A Gran Colombia (1819-1831) unia Colômbia, Venezuela, Equador e Panamá. Foi o sonho de Bolívar de uma América Latina unida!",
                "curiosidade_es": "¡La Gran Colombia (1819-1831) unía Colombia, Venezuela, Ecuador y Panamá. Fue el sueño de Bolívar de una América Latina unida!"
            },
            {
                "id": 39,
                "pergunta": "Qual cidade foi capital da Gran Colombia?",
                "pergunta_es": "¿Qué ciudad fue capital de la Gran Colombia?",
                "opcoes": ["Lima", "Bogotá", "Caracas", "Quito"],
                "correta": "Bogotá",
                "curiosidade": "Bogotá está a 2.640 metros de altitude, sendo uma das capitais mais altas do mundo! O clima é conhecido como 'primavera eterna'.",
                "curiosidade_es": "¡Bogotá está a 2.640 metros de altitud, siendo una de las capitales más altas del mundo! El clima es conocido como 'primavera eterna'."
            },
            {
                "id": 40,
                "pergunta": "Qual foi o período conhecido como 'La Violencia'?",
                "pergunta_es": "¿Cuál fue el período conocido como 'La Violencia'?",
                "opcoes": ["1900-1910", "1948-1958", "1980-1990", "2000-2010"],
                "correta": "1948-1958",
                "curiosidade": "La Violencia começou com o assassinato do líder político Jorge Eliécer Gaitán. Estima-se que 200.000 a 300.000 pessoas morreram neste período.",
                "curiosidade_es": "La Violencia comenzó con el asesinato del líder político Jorge Eliécer Gaitán. Se estima que 200.000 a 300.000 personas murieron en este período."
            }
        ]
    },
    5: {
        "tema": "Narcotráfico",
        "tema_es": "Narcotráfico",
        "perguntas": [
            {
                "id": 41,
                "pergunta": "Quem foi Pablo Escobar?",
                "pergunta_es": "¿Quién fue Pablo Escobar?",
                "opcoes": ["Presidente", "Cantor", "Narcotraficante", "Ator"],
                "correta": "Narcotraficante",
                "curiosidade": "Pablo Escobar chegou a ser o 7º homem mais rico do mundo segundo a Forbes! Estima-se que ganhava $420 milhões por semana com o tráfico.",
                "curiosidade_es": "¡Pablo Escobar llegó a ser el 7º hombre más rico del mundo según Forbes! Se estima que ganaba $420 millones por semana con el tráfico."
            },
            {
                "id": 42,
                "pergunta": "Qual cidade estava associada ao cartel de Escobar?",
                "pergunta_es": "¿Qué ciudad estaba asociada con el cartel de Escobar?",
                "opcoes": ["Bogotá", "Medellín", "Cali", "Cartagena"],
                "correta": "Medellín",
                "curiosidade": "Hoje, Medellín é uma das cidades mais inovadoras do mundo! Passou por uma transformação incrível e é exemplo de urbanismo social.",
                "curiosidade_es": "¡Hoy, Medellín es una de las ciudades más innovadoras del mundo! Pasó por una transformación increíble y es ejemplo de urbanismo social."
            },
            {
                "id": 43,
                "pergunta": "Como era conhecido o cartel de Pablo Escobar?",
                "pergunta_es": "¿Cómo se conocía el cartel de Pablo Escobar?",
                "opcoes": ["Cartel de Cali", "Cartel de Medellín", "Cartel de Bogotá", "Cartel del Norte"],
                "correta": "Cartel de Medellín",
                "curiosidade": "No auge, o Cartel de Medellín controlava 80% da cocaína mundial! Escobar tinha até submarinos para transportar drogas.",
                "curiosidade_es": "¡En su apogeo, el Cartel de Medellín controlaba el 80% de la cocaína mundial! Escobar tenía hasta submarinos para transportar drogas."
            },
            {
                "id": 44,
                "pergunta": "Qual era o apelido de Pablo Escobar?",
                "pergunta_es": "¿Cuál era el apodo de Pablo Escobar?",
                "opcoes": ["El Patrón", "El Chapo", "El Señor", "El Jefe"],
                "correta": "El Patrón",
                "curiosidade": "Escobar também era chamado de 'Robin Hood Paisa' porque construía casas, campos de futebol e escolas para os pobres de Medellín.",
                "curiosidade_es": "Escobar también era llamado 'Robin Hood Paisa' porque construía casas, campos de fútbol y escuelas para los pobres de Medellín."
            },
            {
                "id": 45,
                "pergunta": "Em que ano morreu Pablo Escobar?",
                "pergunta_es": "¿En qué año murió Pablo Escobar?",
                "opcoes": ["1990", "1993", "1995", "2000"],
                "correta": "1993",
                "curiosidade": "Escobar foi morto em 2 de dezembro de 1993, um dia após seu 44º aniversário. Ele estava fugindo havia 16 meses quando foi encontrado em Medellín.",
                "curiosidade_es": "Escobar murió el 2 de diciembre de 1993, un día después de su 44º cumpleaños. Llevaba 16 meses fugitivo cuando fue encontrado en Medellín."
            },
            {
                "id": 46,
                "pergunta": "Qual cartel era rival do Cartel de Medellín?",
                "pergunta_es": "¿Qué cartel era rival del Cartel de Medellín?",
                "opcoes": ["Cartel de Cali", "Cartel de Tijuana", "Cartel de Sinaloa", "Cartel del Golfo"],
                "correta": "Cartel de Cali",
                "curiosidade": "O Cartel de Cali era mais discreto e usava táticas empresariais. Eram conhecidos como 'Os Cavalheiros de Cali' por serem menos violentos.",
                "curiosidade_es": "El Cartel de Cali era más discreto y usaba tácticas empresariales. Eran conocidos como 'Los Caballeros de Cali' por ser menos violentos."
            },
            {
                "id": 47,
                "pergunta": "Qual série retrata a vida de Pablo Escobar?",
                "pergunta_es": "¿Qué serie retrata la vida de Pablo Escobar?",
                "opcoes": ["Breaking Bad", "Narcos", "El Chapo", "La Casa de Papel"],
                "correta": "Narcos",
                "curiosidade": "A série Narcos da Netflix foi filmada na Colômbia e usou muitas locações reais! O ator brasileiro Wagner Moura interpretou Escobar.",
                "curiosidade_es": "¡La serie Narcos de Netflix fue filmada en Colombia y usó muchas locaciones reales! El actor brasileño Wagner Moura interpretó a Escobar."
            },
            {
                "id": 48,
                "pergunta": "Onde Escobar construiu sua própria prisão?",
                "pergunta_es": "¿Dónde construyó Escobar su propia prisión?",
                "opcoes": ["Bogotá", "La Catedral", "Cartagena", "Cali"],
                "correta": "La Catedral",
                "curiosidade": "La Catedral tinha jacuzzi, discoteca, campo de futebol e vista para Medellín! Escobar fugiu em 1992 quando o governo tentou transferi-lo.",
                "curiosidade_es": "¡La Catedral tenía jacuzzi, discoteca, campo de fútbol y vista a Medellín! Escobar escapó en 1992 cuando el gobierno intentó transferirlo."
            },
            {
                "id": 49,
                "pergunta": "Qual organização americana perseguiu os cartéis colombianos?",
                "pergunta_es": "¿Qué organización americana persiguió a los carteles colombianos?",
                "opcoes": ["FBI", "CIA", "DEA", "NSA"],
                "correta": "DEA",
                "curiosidade": "A DEA (Drug Enforcement Administration) trabalhou junto com a Polícia Nacional da Colômbia no 'Bloco de Busca' para capturar Escobar.",
                "curiosidade_es": "La DEA (Drug Enforcement Administration) trabajó junto con la Policía Nacional de Colombia en el 'Bloque de Búsqueda' para capturar a Escobar."
            },
            {
                "id": 50,
                "pergunta": "Qual grupo ajudou a derrubar Pablo Escobar?",
                "pergunta_es": "¿Qué grupo ayudó a derribar a Pablo Escobar?",
                "opcoes": ["Los Pepes", "Las FARC", "ELN", "M-19"],
                "correta": "Los Pepes",
                "curiosidade": "'Los Pepes' significa 'Perseguidos por Pablo Escobar'. Era um grupo paramilitar que atacava propriedades e associados de Escobar.",
                "curiosidade_es": "'Los Pepes' significa 'Perseguidos por Pablo Escobar'. Era un grupo paramilitar que atacaba propiedades y asociados de Escobar."
            }
        ]
    }
}

# ============================================
# ENDPOINTS DE AUTENTICAÇÃO
# ============================================

@api_router.post("/auth/register")
async def register(user: UserRegister, response: Response):
    """
    Regista um novo utilizador
    - Verifica se email já existe
    - Encripta password
    - Cria tokens JWT
    """
    email = user.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    user_doc = {
        "name": user.name,
        "email": email,
        "password_hash": hashed,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
        # ALTERAÇÃO: Campos para ranking
        "total_score": 0,
        "games_played": 0,
        "best_scores": {}
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="none", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="none", max_age=604800, path="/")
    
    return {"id": user_id, "name": user.name, "email": email, "role": "user"}

@api_router.post("/auth/login")
async def login(user: UserLogin, response: Response):
    """
    Autentica um utilizador existente
    - Verifica credenciais
    - Retorna tokens JWT em cookies
    """
    email = user.email.lower()
    existing = await db.users.find_one({"email": email})
    if not existing:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user.password, existing["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(existing["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="none", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="none", max_age=604800, path="/")
    
    return {"id": user_id, "name": existing["name"], "email": email, "role": existing.get("role", "user")}

@api_router.post("/auth/logout")
async def logout(response: Response):
    """Remove os cookies de autenticação"""
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Retorna os dados do utilizador autenticado"""
    user = await get_current_user(request)
    return user

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    """Renova o token de acesso usando o refresh token"""
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        user_id = str(user["_id"])
        access_token = create_access_token(user_id, user["email"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="none", max_age=900, path="/")
        
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ============================================
# ENDPOINTS DO QUIZ
# ALTERAÇÃO: Perguntas são embaralhadas
# ============================================

@api_router.get("/quiz/levels")
async def get_levels():
    """Retorna a lista de todos os níveis disponíveis"""
    levels = []
    for level_num, data in QUIZ_DATA.items():
        levels.append({
            "level": level_num,
            "tema": data["tema"],
            "tema_es": data["tema_es"],
            "total_questions": len(data["perguntas"])
        })
    return levels

@api_router.get("/quiz/level/{level_num}")
async def get_level_questions(level_num: int, lang: str = "pt"):
    """
    Retorna as perguntas de um nível específico
    ALTERAÇÃO: Perguntas são embaralhadas aleatoriamente
    """
    if level_num not in QUIZ_DATA:
        raise HTTPException(status_code=404, detail="Level not found")
    
    data = QUIZ_DATA[level_num]
    
    # ALTERAÇÃO: Criar cópia das perguntas e embaralhar
    perguntas_shuffled = data["perguntas"].copy()
    random.shuffle(perguntas_shuffled)
    
    questions = []
    for q in perguntas_shuffled:
        # ALTERAÇÃO: Também embaralhar as opções de resposta
        opcoes_shuffled = q["opcoes"].copy()
        random.shuffle(opcoes_shuffled)
        
        questions.append({
            "id": q["id"],
            "pergunta": q["pergunta_es"] if lang == "es" else q["pergunta"],
            "opcoes": opcoes_shuffled
        })
    
    return {
        "level": level_num,
        "tema": data["tema_es"] if lang == "es" else data["tema"],
        "questions": questions
    }

@api_router.post("/quiz/check-answer")
async def check_answer(answer: AnswerSubmit, lang: str = "pt"):
    """
    Verifica se a resposta está correta
    ALTERAÇÃO: Retorna também a curiosidade sobre a pergunta
    """
    for level_data in QUIZ_DATA.values():
        for q in level_data["perguntas"]:
            if q["id"] == answer.question_id:
                # ALTERAÇÃO: Incluir curiosidade na resposta
                curiosidade = q.get("curiosidade_es" if lang == "es" else "curiosidade", "")
                return {
                    "correct": answer.answer == q["correta"],
                    "correct_answer": q["correta"],
                    "curiosidade": curiosidade  # ALTERAÇÃO: Campo de curiosidade
                }
    raise HTTPException(status_code=404, detail="Question not found")

# ============================================
# ENDPOINTS DE RANKING
# ALTERAÇÃO: Novo sistema de ranking global
# ============================================

@api_router.post("/ranking/submit")
async def submit_score(score_data: ScoreSubmit, request: Request):
    """
    Submete pontuação para o ranking
    ALTERAÇÃO: Novo endpoint para salvar scores
    """
    try:
        user = await get_current_user(request)
        user_id = user["_id"]
        
        # Atualizar pontuação total do utilizador
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$inc": {
                    "total_score": score_data.score,
                    "games_played": 1
                },
                "$max": {
                    f"best_scores.level_{score_data.level}": score_data.score
                }
            }
        )
        
        # Salvar entrada no ranking
        ranking_entry = {
            "user_id": user_id,
            "user_name": user["name"],
            "level": score_data.level,
            "score": score_data.score,
            "total": score_data.total,
            "percentage": round((score_data.score / score_data.total) * 100, 1),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.rankings.insert_one(ranking_entry)
        
        return {"message": "Score submitted successfully"}
    except HTTPException:
        raise HTTPException(status_code=401, detail="Login required to submit score")

@api_router.get("/ranking/global")
async def get_global_ranking():
    """
    Retorna o ranking global de todos os utilizadores
    ALTERAÇÃO: Novo endpoint para ranking
    """
    # Buscar top utilizadores por pontuação total
    pipeline = [
        {
            "$match": {"role": {"$ne": "admin"}}
        },
        {
            "$project": {
                "_id": 0,
                "name": 1,
                "total_score": {"$ifNull": ["$total_score", 0]},
                "games_played": {"$ifNull": ["$games_played", 0]},
                "best_scores": {"$ifNull": ["$best_scores", {}]}
            }
        },
        {
            "$sort": {"total_score": -1}
        },
        {
            "$limit": 50
        }
    ]
    
    users = await db.users.aggregate(pipeline).to_list(50)
    
    # Adicionar posição no ranking
    for i, user in enumerate(users):
        user["position"] = i + 1
    
    return users

@api_router.get("/ranking/level/{level_num}")
async def get_level_ranking(level_num: int):
    """
    Retorna o ranking de um nível específico
    ALTERAÇÃO: Novo endpoint para ranking por nível
    """
    pipeline = [
        {
            "$match": {"level": level_num}
        },
        {
            "$sort": {"score": -1, "created_at": 1}
        },
        {
            "$limit": 20
        },
        {
            "$project": {
                "_id": 0,
                "user_name": 1,
                "score": 1,
                "total": 1,
                "percentage": 1,
                "created_at": 1
            }
        }
    ]
    
    rankings = await db.rankings.aggregate(pipeline).to_list(20)
    
    for i, entry in enumerate(rankings):
        entry["position"] = i + 1
    
    return rankings

@api_router.get("/ranking/user/{user_id}")
async def get_user_stats(user_id: str, request: Request):
    """
    Retorna estatísticas de um utilizador específico
    ALTERAÇÃO: Novo endpoint para stats pessoais
    """
    try:
        user = await db.users.find_one(
            {"_id": ObjectId(user_id)},
            {"_id": 0, "password_hash": 0}
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Buscar histórico de jogos
        history = await db.rankings.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("created_at", -1).limit(10).to_list(10)
        
        return {
            "user": user,
            "history": history
        }
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")

@api_router.get("/")
async def root():
    """Endpoint raiz da API"""
    return {"message": "Quiz Colombia API v2.0"}

# ============================================
# CONFIGURAÇÃO CORS E MIDDLEWARE
# ============================================
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["https://valorantmeirritadms-png.github.io/exemplo_quiz", "https://valorantmeirritadms-png.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# EVENTOS DE STARTUP
# Criação de índices e seed do admin
# ============================================
@app.on_event("startup")
async def startup_event():
    """Inicialização da aplicação"""
    # Criar índices
    await db.users.create_index("email", unique=True)
    await db.rankings.create_index([("level", 1), ("score", -1)])
    await db.rankings.create_index("user_id")
    
    # Seed do admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "total_score": 0,
            "games_played": 0,
            "best_scores": {}
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
    
    # Escrever credenciais de teste
    import os as os_module
    memory_dir = Path("./memory")
    memory_dir.mkdir(exist_ok=True, parents=True)
    with open(memory_dir / "test_credentials.md", "w") as f:
        f.write(f"""# Test Credentials

## Admin Account
- Email: {admin_email}
- Password: {admin_password}
- Role: admin

## Auth Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/refresh

## Quiz Endpoints
- GET /api/quiz/levels
- GET /api/quiz/level/<level_num>?lang=pt|es
- POST /api/quiz/check-answer

## Ranking Endpoints (NOVO)
- POST /api/ranking/submit
- GET /api/ranking/global
- GET /api/ranking/level/<level_num>
- GET /api/ranking/user/<user_id>
""")

# ============================================
# LOGGING
# ============================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    """Encerramento da conexão com MongoDB"""
    client.close()
