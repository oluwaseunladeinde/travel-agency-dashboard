import React from 'react'
import {Header} from "../../../components";

const AllUsers = () => {
    const user = { name: 'Oluwaseun'}
    return (
        <main className="dashboard wrapper">
            <Header
                title={`Trips Page 👋`}
                description="Check out current users in real time"
            />

            All Users Page Content
        </main>
    )
}
export default AllUsers
