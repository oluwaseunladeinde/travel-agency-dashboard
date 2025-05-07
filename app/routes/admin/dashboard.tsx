import type { Route } from './+types/dashboard';
import {Header, TripCard, StatsCard} from "../../../components";
import {allTrips, dashboardStats, user} from "~/constants";

import {getUser} from "~/appwrite/auth";

export async function clientLoader() {
    const [
        user,
    ] = await Promise.all([
        await getUser(),
    ])

    return {
        user
    }
}

const Dashboard = ({ loaderData }: Route.ComponentProps) => {

    const user = loaderData.user as User | null;

    const {totalUsers, userRole, usersJoined, totalTrips, tripsCreated} = dashboardStats;
    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome, ${user?.name ?? 'Guest'} 👋`}
                description="Track activity, trends, and popular destinations in real time"
            />

            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard
                        headerTitle="Total Users"
                        total={totalUsers}
                        lastMonthCount={usersJoined.lastMonth}
                        currentMonthCount={usersJoined.currentMonth}
                    />
                    <StatsCard
                        headerTitle="Total Trips"
                        total={totalTrips}
                        lastMonthCount={tripsCreated.lastMonth}
                        currentMonthCount={tripsCreated.currentMonth}
                    />
                    <StatsCard
                        headerTitle="Active Users Today"
                        total={userRole.total}
                        lastMonthCount={userRole.lastMonth}
                        currentMonthCount={userRole.currentMonth}
                    />
                </div>
            </section>
            <section className="container">
                <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
                <div className='trip-grid'>
                    {allTrips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id.toString()}
                            name={trip.name!}
                            imageUrl={trip.imageUrls[0]}
                            location={trip.itinerary?.[0]?.location ?? ''}
                            tags={trip.tags}
                            price={trip.estimatedPrice!}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}
export default Dashboard
