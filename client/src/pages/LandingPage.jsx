export default function LandingPage(){
    const BASE_IP=import.meta.env.BASE_URL;
    return (
        <div>
            <ul>
            <li><a href={`${BASE_IP}dashboard`}>Dashboard</a></li>
            <li><a href={`${BASE_IP}profile`}>Profile</a></li>
            </ul>
        </div>
    );

}