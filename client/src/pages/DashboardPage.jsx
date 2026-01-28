import { useAuth } from "../context/authContext";

export default function DashboardPage(){
    const BASE_IP=import.meta.env.BASE_URL;
    const {user} = useAuth();
    return (
        <div>
            <h1>Dashboard</h1>
            <ul>Contenido:
                <li>General: Lista de cursos disponibles</li>
                <li>General: Acceso al perfil propio</li>
                <li>Al menos profesor en un curso: Gestión de badgespara todos los cursos</li>
                <li><a href={`${BASE_IP}`}>&lt;== Landing</a></li>
            </ul>
        </div>
    );
}