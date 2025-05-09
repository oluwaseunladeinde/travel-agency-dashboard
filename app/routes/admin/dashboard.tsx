import type { Route } from './+types/dashboard';
import {Header, TripCard, StatsCard} from "../../../components";
import {dashboardStats, user} from "~/constants";

import {getAllUsers, getUser} from "~/appwrite/auth";
import {getAllTrips} from "~/appwrite/trips";
import {parseTripData} from "~/lib/utils";

export async function clientLoader() {
    const [
        user,
        trips,
        allUsers,
    ] = await Promise.all([
        await getUser(),
        await getAllTrips(4, 0),
        await getAllUsers(4, 0),
    ]);

    const allTrips = trips.allTrips.map(({ $id, tripDetails, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetails),
        imageUrls: imageUrls ?? []
    }));

    const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
        imageUrl: user.imageUrl,
        name: user.name,
        count: user.itineraryCount ?? Math.floor(Math.random() * 10),
    }))

    return {
        user,
        allTrips,
        allUsers: mappedUsers
    }
}

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    const user = loaderData.user as User | null;

    const {totalUsers, userRole, usersJoined, totalTrips, tripsCreated} = dashboardStats;

    const { allTrips, allUsers } = loaderData;

    const trips = allTrips.map((trip) => ({
        imageUrl: trip.imageUrls[0],
        name: trip.name,
        interest: trip.interests,
    }))

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
                            tags={[trip.interests!, trip.travelStyle!]}
                            price={trip.estimatedPrice!}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}
export default Dashboard
