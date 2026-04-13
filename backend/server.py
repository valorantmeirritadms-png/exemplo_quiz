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
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
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

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str = "user"

class QuestionResponse(BaseModel):
    id: int
    pergunta: str
    opcoes: List[str]

class AnswerSubmit(BaseModel):
    question_id: int
    answer: str

class QuizResult(BaseModel):
    level: int
    score: int
    total: int

# Quiz Data - 50 questions across 5 levels
QUIZ_DATA = {
    1: {
        "tema": "Cantores",
        "tema_es": "Cantantes",
        "perguntas": [
            {"id": 1, "pergunta": "Quem é a cantora colombiana famosa pela música 'Hips Don't Lie'?", "pergunta_es": "¿Quién es la cantante colombiana famosa por la canción 'Hips Don't Lie'?", "opcoes": ["Karol G", "Shakira", "Becky G", "Rosalía"], "correta": "Shakira"},
            {"id": 2, "pergunta": "Qual destes artistas é conhecido pelo reggaeton?", "pergunta_es": "¿Cuál de estos artistas es conocido por el reggaetón?", "opcoes": ["Juanes", "J Balvin", "Carlos Vives", "Fonseca"], "correta": "J Balvin"},
            {"id": 3, "pergunta": "Quem canta 'La Bicicleta' junto com Shakira?", "pergunta_es": "¿Quién canta 'La Bicicleta' junto con Shakira?", "opcoes": ["Maluma", "Carlos Vives", "J Balvin", "Daddy Yankee"], "correta": "Carlos Vives"},
            {"id": 4, "pergunta": "Qual cantor colombiano é famoso pela música 'Felices los 4'?", "pergunta_es": "¿Qué cantante colombiano es famoso por la canción 'Felices los 4'?", "opcoes": ["Maluma", "Nicky Jam", "Ozuna", "Bad Bunny"], "correta": "Maluma"},
            {"id": 5, "pergunta": "Quem é conhecida como 'La Bichota'?", "pergunta_es": "¿Quién es conocida como 'La Bichota'?", "opcoes": ["Shakira", "Karol G", "Anitta", "Natti Natasha"], "correta": "Karol G"},
            {"id": 6, "pergunta": "Qual artista colombiano ganhou vários Grammy Latinos com rock em espanhol?", "pergunta_es": "¿Qué artista colombiano ganó varios Grammy Latinos con rock en español?", "opcoes": ["Juanes", "Fonseca", "Silvestre Dangond", "Diomedes Díaz"], "correta": "Juanes"},
            {"id": 7, "pergunta": "Quem canta 'Mi Gente' junto com J Balvin?", "pergunta_es": "¿Quién canta 'Mi Gente' junto con J Balvin?", "opcoes": ["Willy William", "Daddy Yankee", "Bad Bunny", "Nicky Jam"], "correta": "Willy William"},
            {"id": 8, "pergunta": "Qual é o nome artístico de Édgar Rentería no mundo da música?", "pergunta_es": "¿Cuál es el nombre artístico de Édgar Rentería en el mundo de la música?", "opcoes": ["Fonseca", "Pipe Bueno", "Ryan Castro", "Blessd"], "correta": "Fonseca"},
            {"id": 9, "pergunta": "Quem é o 'Rey del Vallenato' mais famoso da Colômbia?", "pergunta_es": "¿Quién es el 'Rey del Vallenato' más famoso de Colombia?", "opcoes": ["Carlos Vives", "Diomedes Díaz", "Silvestre Dangond", "Jorge Celedón"], "correta": "Diomedes Díaz"},
            {"id": 10, "pergunta": "Qual cantora colombiana é famosa por 'Tusa'?", "pergunta_es": "¿Qué cantante colombiana es famosa por 'Tusa'?", "opcoes": ["Shakira", "Karol G", "Fanny Lu", "Greeicy"], "correta": "Karol G"}
        ]
    },
    2: {
        "tema": "Cultura",
        "tema_es": "Cultura",
        "perguntas": [
            {"id": 11, "pergunta": "Qual é a dança tradicional mais famosa da Colômbia?", "pergunta_es": "¿Cuál es el baile tradicional más famoso de Colombia?", "opcoes": ["Salsa", "Cumbia", "Tango", "Flamenco"], "correta": "Cumbia"},
            {"id": 12, "pergunta": "Qual é a língua oficial da Colômbia?", "pergunta_es": "¿Cuál es el idioma oficial de Colombia?", "opcoes": ["Português", "Espanhol", "Inglês", "Francês"], "correta": "Espanhol"},
            {"id": 13, "pergunta": "Qual é o chapéu tradicional colombiano?", "pergunta_es": "¿Cuál es el sombrero tradicional colombiano?", "opcoes": ["Fedora", "Sombrero vueltiao", "Panama", "Cowboy"], "correta": "Sombrero vueltiao"},
            {"id": 14, "pergunta": "Qual festival é o mais famoso de Barranquilla?", "pergunta_es": "¿Cuál festival es el más famoso de Barranquilla?", "opcoes": ["Festival de Cali", "Carnaval de Barranquilla", "Feria de las Flores", "Festival Vallenato"], "correta": "Carnaval de Barranquilla"},
            {"id": 15, "pergunta": "Qual é a flor nacional da Colômbia?", "pergunta_es": "¿Cuál es la flor nacional de Colombia?", "opcoes": ["Rosa", "Orquídea", "Girassol", "Tulipa"], "correta": "Orquídea"},
            {"id": 16, "pergunta": "Qual escritor colombiano ganhou o Prémio Nobel de Literatura?", "pergunta_es": "¿Qué escritor colombiano ganó el Premio Nobel de Literatura?", "opcoes": ["Pablo Neruda", "Gabriel García Márquez", "Mario Vargas Llosa", "Jorge Luis Borges"], "correta": "Gabriel García Márquez"},
            {"id": 17, "pergunta": "Qual é o instrumento típico do vallenato?", "pergunta_es": "¿Cuál es el instrumento típico del vallenato?", "opcoes": ["Guitarra", "Acordeão", "Piano", "Flauta"], "correta": "Acordeão"},
            {"id": 18, "pergunta": "Qual cidade é conhecida como a 'capital da salsa'?", "pergunta_es": "¿Qué ciudad es conocida como la 'capital de la salsa'?", "opcoes": ["Bogotá", "Medellín", "Cali", "Cartagena"], "correta": "Cali"},
            {"id": 19, "pergunta": "Qual é o livro mais famoso de García Márquez?", "pergunta_es": "¿Cuál es el libro más famoso de García Márquez?", "opcoes": ["Dom Quixote", "Cem Anos de Solidão", "O Alquimista", "1984"], "correta": "Cem Anos de Solidão"},
            {"id": 20, "pergunta": "Qual é o desporto mais popular na Colômbia?", "pergunta_es": "¿Cuál es el deporte más popular en Colombia?", "opcoes": ["Basquete", "Futebol", "Basebol", "Ténis"], "correta": "Futebol"}
        ]
    },
    3: {
        "tema": "Gastronomia",
        "tema_es": "Gastronomía",
        "perguntas": [
            {"id": 21, "pergunta": "Qual é um prato típico feito de milho?", "pergunta_es": "¿Cuál es un plato típico hecho de maíz?", "opcoes": ["Taco", "Arepa", "Pizza", "Hambúrguer"], "correta": "Arepa"},
            {"id": 22, "pergunta": "O que é 'Bandeja Paisa'?", "pergunta_es": "¿Qué es 'Bandeja Paisa'?", "opcoes": ["Uma bebida", "Uma sobremesa", "Um prato típico", "Uma dança"], "correta": "Um prato típico"},
            {"id": 23, "pergunta": "Qual bebida colombiana é feita com panela?", "pergunta_es": "¿Qué bebida colombiana está hecha con panela?", "opcoes": ["Café", "Aguapanela", "Cerveja", "Rum"], "correta": "Aguapanela"},
            {"id": 24, "pergunta": "Qual é a fruta colombiana conhecida por seu sabor ácido?", "pergunta_es": "¿Cuál es la fruta colombiana conocida por su sabor ácido?", "opcoes": ["Banana", "Lulo", "Maçã", "Uva"], "correta": "Lulo"},
            {"id": 25, "pergunta": "O que é 'Ajiaco'?", "pergunta_es": "¿Qué es 'Ajiaco'?", "opcoes": ["Um prato de peixe", "Uma sopa típica de Bogotá", "Uma sobremesa", "Um tipo de carne"], "correta": "Uma sopa típica de Bogotá"},
            {"id": 26, "pergunta": "Qual café é famoso mundialmente por sua qualidade?", "pergunta_es": "¿Qué café es mundialmente famoso por su calidad?", "opcoes": ["Café Brasileiro", "Café Colombiano", "Café Italiano", "Café Turco"], "correta": "Café Colombiano"},
            {"id": 27, "pergunta": "O que são 'empanadas' colombianas?", "pergunta_es": "¿Qué son las 'empanadas' colombianas?", "opcoes": ["Doces", "Pastéis fritos recheados", "Bebidas", "Sopas"], "correta": "Pastéis fritos recheados"},
            {"id": 28, "pergunta": "Qual é a bebida alcoólica típica da Colômbia?", "pergunta_es": "¿Cuál es la bebida alcohólica típica de Colombia?", "opcoes": ["Tequila", "Aguardiente", "Cachaça", "Whisky"], "correta": "Aguardiente"},
            {"id": 29, "pergunta": "O que é 'Sancocho'?", "pergunta_es": "¿Qué es 'Sancocho'?", "opcoes": ["Uma salada", "Uma sopa com carnes e legumes", "Uma sobremesa", "Um pão"], "correta": "Uma sopa com carnes e legumes"},
            {"id": 30, "pergunta": "Qual região colombiana é famosa pelo café?", "pergunta_es": "¿Qué región colombiana es famosa por el café?", "opcoes": ["Costa Caribe", "Eje Cafetero", "Amazônia", "Los Llanos"], "correta": "Eje Cafetero"}
        ]
    },
    4: {
        "tema": "História",
        "tema_es": "Historia",
        "perguntas": [
            {"id": 31, "pergunta": "Em que ano começou a independência da Colômbia?", "pergunta_es": "¿En qué año comenzó la independencia de Colombia?", "opcoes": ["1810", "1492", "1900", "1700"], "correta": "1810"},
            {"id": 32, "pergunta": "Quem foi Simón Bolívar?", "pergunta_es": "¿Quién fue Simón Bolívar?", "opcoes": ["Cantor", "Libertador", "Ator", "Jogador"], "correta": "Libertador"},
            {"id": 33, "pergunta": "Qual civilização indígena habitou a Colômbia?", "pergunta_es": "¿Qué civilización indígena habitó Colombia?", "opcoes": ["Maias", "Muiscas", "Incas", "Astecas"], "correta": "Muiscas"},
            {"id": 34, "pergunta": "Qual país colonizou a Colômbia?", "pergunta_es": "¿Qué país colonizó Colombia?", "opcoes": ["Portugal", "Espanha", "França", "Inglaterra"], "correta": "Espanha"},
            {"id": 35, "pergunta": "Qual era o nome da Colômbia antes da independência?", "pergunta_es": "¿Cuál era el nombre de Colombia antes de la independencia?", "opcoes": ["Nueva Granada", "Perú", "Venezuela", "México"], "correta": "Nueva Granada"},
            {"id": 36, "pergunta": "Quem foi Antonio Nariño?", "pergunta_es": "¿Quién fue Antonio Nariño?", "opcoes": ["Um pintor", "Um prócer da independência", "Um cantor", "Um chef"], "correta": "Um prócer da independência"},
            {"id": 37, "pergunta": "Qual é a data da independência da Colômbia?", "pergunta_es": "¿Cuál es la fecha de independencia de Colombia?", "opcoes": ["7 de agosto", "20 de julho", "15 de setembro", "12 de outubro"], "correta": "20 de julho"},
            {"id": 38, "pergunta": "O que foi a 'Gran Colombia'?", "pergunta_es": "¿Qué fue la 'Gran Colombia'?", "opcoes": ["Uma cidade", "Uma união de países", "Um rio", "Uma montanha"], "correta": "Uma união de países"},
            {"id": 39, "pergunta": "Qual cidade foi capital da Gran Colombia?", "pergunta_es": "¿Qué ciudad fue capital de la Gran Colombia?", "opcoes": ["Lima", "Bogotá", "Caracas", "Quito"], "correta": "Bogotá"},
            {"id": 40, "pergunta": "Qual foi o período conhecido como 'La Violencia'?", "pergunta_es": "¿Cuál fue el período conocido como 'La Violencia'?", "opcoes": ["1900-1910", "1948-1958", "1980-1990", "2000-2010"], "correta": "1948-1958"}
        ]
    },
    5: {
        "tema": "Narcotráfico",
        "tema_es": "Narcotráfico",
        "perguntas": [
            {"id": 41, "pergunta": "Quem foi Pablo Escobar?", "pergunta_es": "¿Quién fue Pablo Escobar?", "opcoes": ["Presidente", "Cantor", "Narcotraficante", "Ator"], "correta": "Narcotraficante"},
            {"id": 42, "pergunta": "Qual cidade estava associada ao cartel de Escobar?", "pergunta_es": "¿Qué ciudad estaba asociada con el cartel de Escobar?", "opcoes": ["Bogotá", "Medellín", "Cali", "Cartagena"], "correta": "Medellín"},
            {"id": 43, "pergunta": "Como era conhecido o cartel de Pablo Escobar?", "pergunta_es": "¿Cómo se conocía el cartel de Pablo Escobar?", "opcoes": ["Cartel de Cali", "Cartel de Medellín", "Cartel de Bogotá", "Cartel del Norte"], "correta": "Cartel de Medellín"},
            {"id": 44, "pergunta": "Qual era o apelido de Pablo Escobar?", "pergunta_es": "¿Cuál era el apodo de Pablo Escobar?", "opcoes": ["El Patrón", "El Chapo", "El Señor", "El Jefe"], "correta": "El Patrón"},
            {"id": 45, "pergunta": "Em que ano morreu Pablo Escobar?", "pergunta_es": "¿En qué año murió Pablo Escobar?", "opcoes": ["1990", "1993", "1995", "2000"], "correta": "1993"},
            {"id": 46, "pergunta": "Qual cartel era rival do Cartel de Medellín?", "pergunta_es": "¿Qué cartel era rival del Cartel de Medellín?", "opcoes": ["Cartel de Cali", "Cartel de Tijuana", "Cartel de Sinaloa", "Cartel del Golfo"], "correta": "Cartel de Cali"},
            {"id": 47, "pergunta": "Qual série retrata a vida de Pablo Escobar?", "pergunta_es": "¿Qué serie retrata la vida de Pablo Escobar?", "opcoes": ["Breaking Bad", "Narcos", "El Chapo", "La Casa de Papel"], "correta": "Narcos"},
            {"id": 48, "pergunta": "Onde Escobar construiu sua própria prisão?", "pergunta_es": "¿Dónde construyó Escobar su propia prisión?", "opcoes": ["Bogotá", "La Catedral", "Cartagena", "Cali"], "correta": "La Catedral"},
            {"id": 49, "pergunta": "Qual organização americana perseguiu os cartéis colombianos?", "pergunta_es": "¿Qué organización americana persiguió a los carteles colombianos?", "opcoes": ["FBI", "CIA", "DEA", "NSA"], "correta": "DEA"},
            {"id": 50, "pergunta": "Qual grupo ajudou a derrubar Pablo Escobar?", "pergunta_es": "¿Qué grupo ayudó a derribar a Pablo Escobar?", "opcoes": ["Los Pepes", "Las FARC", "ELN", "M-19"], "correta": "Los Pepes"}
        ]
    }
}

# Auth Endpoints
@api_router.post("/auth/register")
async def register(user: UserRegister, response: Response):
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
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {"id": user_id, "name": user.name, "email": email, "role": "user"}

@api_router.post("/auth/login")
async def login(user: UserLogin, response: Response):
    email = user.email.lower()
    existing = await db.users.find_one({"email": email})
    if not existing:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user.password, existing["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(existing["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {"id": user_id, "name": existing["name"], "email": email, "role": existing.get("role", "user")}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
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
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
        
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# Quiz Endpoints
@api_router.get("/quiz/levels")
async def get_levels():
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
    if level_num not in QUIZ_DATA:
        raise HTTPException(status_code=404, detail="Level not found")
    
    data = QUIZ_DATA[level_num]
    questions = []
    for q in data["perguntas"]:
        questions.append({
            "id": q["id"],
            "pergunta": q["pergunta_es"] if lang == "es" else q["pergunta"],
            "opcoes": q["opcoes"]
        })
    
    return {
        "level": level_num,
        "tema": data["tema_es"] if lang == "es" else data["tema"],
        "questions": questions
    }

@api_router.post("/quiz/check-answer")
async def check_answer(answer: AnswerSubmit):
    for level_data in QUIZ_DATA.values():
        for q in level_data["perguntas"]:
            if q["id"] == answer.question_id:
                return {
                    "correct": answer.answer == q["correta"],
                    "correct_answer": q["correta"]
                }
    raise HTTPException(status_code=404, detail="Question not found")

@api_router.get("/")
async def root():
    return {"message": "Quiz Colombia API"}

# Include the router in the main app
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event - seed admin
@app.on_event("startup")
async def startup_event():
    await db.users.create_index("email", unique=True)
    
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
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
    
    # Write test credentials
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
""")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
