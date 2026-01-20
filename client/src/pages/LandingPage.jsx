export default function LandingPage(){
    const BASE_IP=`https://localhost:4443`
    return (
        <div>
            <ul>
            <li><a href={`${BASE_IP}/dashboard/0`}>Dashboard</a></li>
            <li><a href={`${BASE_IP}/profile/0`}>Profile</a></li>
            </ul>
        </div>
    )

}