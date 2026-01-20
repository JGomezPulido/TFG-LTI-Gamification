export default function ProfilePage(){
    const BASE_IP=`https://localhost:4443`
    return (
        <div>
            <h1>Perfil</h1>
            <ul>Contenido:
                <li>General: Datos del perfil</li>
                <li>General: Lista de badges obtenidas</li>
                <li><a href={`${BASE_IP}`}>&lt;== Landing</a></li>
            </ul>
        </div>
    )
}