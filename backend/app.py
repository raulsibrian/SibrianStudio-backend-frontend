from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId
from functools import wraps
from werkzeug.utils import secure_filename
from flask import send_from_directory
from PIL import Image
import jwt
import datetime
import certifi
import os
import requests
import base64

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['SECRET_KEY'] = 'clave_secreta_sibrian_studio_2026'
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://sibrianstudio:lamisma1234@sibrianstudio.bwnya2u.mongodb.net/archviz?retryWrites=true&w=majority")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=60000, tls=True, tlsAllowInvalidCertificates=True)
    db = client.get_database("archviz")
    client.admin.command('ping')
    print("Conectado a MongoDB Atlas")
except Exception as e:
    print(f"Error de conexión: {e}")

# Función auxiliar para optimizar y comprimir imágenes automáticamente
def subir_imagen_nube(archivo_imagen):
    image_data = archivo_imagen.read()
    
    # Enviar como form-data usando 'data' en lugar de JSON crudo
    respuesta = requests.post(
        "https://api.imgbb.com/1/upload",
        data={
            "key": "0c9e8c226258d4ce0d95ef0623a784b8",
            "image": base64.b64encode(image_data)
        }
    )
    
    resultado = respuesta.json()
    if resultado.get("success"):
        # Extrae el enlace permanente directo de la respuesta JSON de ImgBB
        return resultado["data"]["url"]
    else:
        raise Exception(f"Error al subir a ImgBB: {resultado}")

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Faltan datos"}), 400

    if db.users.find_one({"email": email}):
        return jsonify({"error": "El usuario ya existe"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    nuevo_usuario = {
        "email": email,
        "password": hashed_password,
        "role": "cliente"
    }
    
    db.users.insert_one(nuevo_usuario)
    return jsonify({"message": "Registro exitoso"}), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})
    
    if user and bcrypt.check_password_hash(user["password"], password):
        token = jwt.encode({
            'user_id': str(user["_id"]),
            'role': user["role"],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({"token": token, "role": user["role"]}), 200
    
    return jsonify({"error": "Credenciales inválidas"}), 401

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token faltante o inválido'}), 401
        try:
            token = auth_header.split(" ")[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.users.find_one({"_id": ObjectId(data['user_id'])})
        except Exception as e:
            return jsonify({'error': 'Token expirado o inválido'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route("/api/cotizaciones", methods=["GET", "POST"])
@token_required
def manejar_cotizaciones(current_user):
    if request.method == "POST":
        nombre_proyecto = request.form.get("nombre_proyecto")
        descripcion = request.form.get("descripcion")
        tiene_planos = request.form.get("tiene_planos") == 'true'
        
        archivo = request.files.get("archivo")
        archivo_url = None
        
        if archivo and archivo.filename:
            filename = secure_filename(archivo.filename)
            nombre_final = f"{str(current_user['_id'])}_{filename}"
            archivo.save(os.path.join(app.config['UPLOAD_FOLDER'], nombre_final))
            archivo_url = f"https://sibrianstudio-backend-frontend.onrender.com/uploads/{nombre_final}"

        nueva_cotizacion = {
            "usuario_id": str(current_user["_id"]),
            "email_cliente": current_user["email"],
            "nombre_proyecto": nombre_proyecto,
            "descripcion": descripcion,
            "tiene_planos": tiene_planos,
            "archivo_url": archivo_url,
            "estado": "Pendiente",
            "fecha": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }
        db.cotizaciones.insert_one(nueva_cotizacion)
        return jsonify({"message": "Cotización registrada exitosamente"}), 201

    if request.method == "GET":
        cotizaciones_cursor = db.cotizaciones.find({"usuario_id": str(current_user["_id"])})
        cotizaciones = []
        for cot in cotizaciones_cursor:
            cot["_id"] = str(cot["_id"])
            cotizaciones.append(cot)
        return jsonify(cotizaciones), 200

@app.route('/uploads/<filename>')
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/api/admin/cotizaciones", methods=["GET"])
@token_required
def admin_obtener_cotizaciones(current_user):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    cotizaciones = []
    for cot in db.cotizaciones.find():
        cot["_id"] = str(cot["_id"])
        cotizaciones.append(cot)
    return jsonify(cotizaciones), 200

@app.route("/api/admin/cotizaciones/<cot_id>", methods=["PUT"])
@token_required
def admin_actualizar_cotizacion(current_user, cot_id):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
        
    nuevo_estado = request.json.get("estado")
    db.cotizaciones.update_one(
        {"_id": ObjectId(cot_id)},
        {"$set": {"estado": nuevo_estado}}
    )
    return jsonify({"message": "Estado actualizado"}), 200

@app.route("/api/proyectos", methods=["POST"])
@token_required
def crear_proyecto(current_user):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
        
    titulo = request.form.get("titulo")
    descripcion = request.form.get("descripcion")
    archivos = request.files.getlist("imagenes")
    imagenes_urls = []
    
    for archivo in archivos:
        if archivo and archivo.filename:
            # Comprimir y optimizar automáticamente
            imagenes_urls.append(subir_imagen_nube(archivo))

    nuevo_proyecto = {
        "titulo": titulo,
        "descripcion": descripcion,
        "imagenes_urls": imagenes_urls,
        "imagen_url": imagenes_urls[0] if imagenes_urls else None,
        "fecha": datetime.datetime.utcnow().strftime("%Y-%m-%d"),
        "destacado": False
    }
    db.proyectos.insert_one(nuevo_proyecto)
    return jsonify({"message": "Proyecto creado exitosamente"}), 201

@app.route("/api/proyectos/<id>", methods=["PUT"])
@token_required
def editar_proyecto(current_user, id):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
        
    titulo = request.form.get("titulo")
    descripcion = request.form.get("descripcion")
    archivos = request.files.getlist("imagenes")
    
    datos_actualizados = {
        "titulo": titulo,
        "descripcion": descripcion
    }
    
    if archivos and archivos[0].filename:
        imagenes_urls = []
        for archivo in archivos:
            imagenes_urls.append(subir_imagen_nube(archivo))
            
        datos_actualizados["imagenes_urls"] = imagenes_urls
        datos_actualizados["imagen_url"] = imagenes_urls[0]
        
    db.proyectos.update_one({"_id": ObjectId(id)}, {"$set": datos_actualizados})
    return jsonify({"message": "Proyecto actualizado"}), 200

@app.route("/api/proyectos/<id>/destacar", methods=["PUT"])
@token_required
def destacar_proyecto(current_user, id):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
    
    proyecto = db.proyectos.find_one({"_id": ObjectId(id)})
    if not proyecto:
        return jsonify({"error": "Proyecto no encontrado"}), 404
        
    nuevo_estado = not proyecto.get("destacado", False)
    db.proyectos.update_one({"_id": ObjectId(id)}, {"$set": {"destacado": nuevo_estado}})
    
    return jsonify({"message": "Actualizado"}), 200

@app.route("/api/proyectos", methods=["GET"])
def obtener_proyectos():
    proyectos_cursor = db.proyectos.find()
    proyectos = []
    for proy in proyectos_cursor:
        proy["_id"] = str(proy["_id"])
        proyectos.append(proy)
    return jsonify(proyectos), 200

@app.route("/api/proyectos/<id>", methods=["GET"])
def obtener_proyecto(id):
    try:
        proyecto = db.proyectos.find_one({"_id": ObjectId(id)})
        if proyecto:
            proyecto["_id"] = str(proyecto["_id"])
            return jsonify(proyecto), 200
        return jsonify({"error": "Proyecto no encontrado"}), 404
    except:
        return jsonify({"error": "ID inválido"}), 400

@app.route("/api/proyectos/<id>", methods=["DELETE"])
@token_required
def eliminar_proyecto(current_user, id):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
        
    db.proyectos.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Proyecto eliminado"}), 200

@app.route("/api/configuracion", methods=["GET"])
def obtener_configuracion():
    config = db.configuracion.find_one()
    if not config:
        config = {
            "titulo_hero": "Visualización Arquitectónica de Alto Nivel",
            "descripcion_hero": "Renders fotorrealistas, recorridos 3D y modelado para potenciar tus proyectos.",
            "email_contacto": "contacto@sibrianstudio.com",
            "empresa_nombre": "Sibrian Studio",
            "instagram_url": "https://www.instagram.com/sibrianstudio/",
            "linkedin_url": "https://www.linkedin.com/in/raul-gonzalez-448a69157/"
        }
        db.configuracion.insert_one(config)
        config = db.configuracion.find_one()
    else:
        if "instagram_url" not in config:
            config["instagram_url"] = "https://www.instagram.com/sibrianstudio/"
        if "linkedin_url" not in config:
            config["linkedin_url"] = "https://www.linkedin.com/in/raul-gonzalez-448a69157/"
        
    config["_id"] = str(config["_id"])
    return jsonify(config), 200

@app.route("/api/configuracion", methods=["PUT"])
@token_required
def actualizar_configuracion(current_user):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
        
    datos = {
        "titulo_hero": request.form.get("titulo_hero"),
        "descripcion_hero": request.form.get("descripcion_hero"),
        "email_contacto": request.form.get("email_contacto"),
        "empresa_nombre": request.form.get("empresa_nombre"),
        "instagram_url": request.form.get("instagram_url"),
        "linkedin_url": request.form.get("linkedin_url")
    }
    
    archivo = request.files.get("hero_image")
    if archivo and archivo.filename:
        # Optimizar imagen de fondo principal también
        datos["hero_image_url"] = subir_imagen_nube(archivo)

    db.configuracion.update_one({}, {"$set": datos}, upsert=True)
    return jsonify({"message": "Configuración actualizada"}), 200

@app.route("/api/admin/usuarios", methods=["GET"])
@token_required
def obtener_usuarios(current_user):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
        
    usuarios = list(db.users.find({}, {"password": 0}))
    for u in usuarios:
        u["_id"] = str(u["_id"])
    return jsonify(usuarios), 200

@app.route("/api/admin/usuarios/<id>", methods=["PUT"])
@token_required
def cambiar_rol_usuario(current_user, id):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
        
    datos = request.json
    nuevo_rol = datos.get("role")
    
    if nuevo_rol not in ["admin", "cliente"]:
        return jsonify({"error": "Rol inválido"}), 400
        
    db.users.update_one({"_id": ObjectId(id)}, {"$set": {"role": nuevo_rol}})
    return jsonify({"message": "Rol actualizado exitosamente"}), 200

@app.route("/api/admin/usuarios/<id>", methods=["DELETE"])
@token_required
def eliminar_usuario(current_user, id):
    if current_user.get("role") != "admin":
        return jsonify({"error": "No autorizado"}), 403
        
    if current_user["_id"] == ObjectId(id):
        return jsonify({"error": "No puedes eliminar tu propia cuenta de administrador"}), 400
        
    db.users.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Usuario eliminado"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)