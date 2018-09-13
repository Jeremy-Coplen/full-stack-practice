import React, { Component } from "react"
import axios from "axios"

import { connect } from "react-redux"
import { getUserData } from "../../ducks/users"

class Private extends Component {

   async componentDidMount() {
       let res = await axios.get("/api/user-data")
       this.props.getUserData(res.data)
    }

    render() {
        const {user_name, email, picture, auth_id} = this.props.user
        return (
            <div>
                <h1>Account Summary</h1>
                <hr/><hr/><hr/>
                {
                    user_name ? (
                        <div>
                            <p>Account Holder: {user_name}</p>
                            <p>Email: {email}</p>
                            <p>Account # {auth_id}</p>
                            <img src={picture} alt=""/>
                        </div>
                    ) : <p>Please Login</p>
                }
                <a href="http://localhost:3005/logout"><button>Logout</button></a>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

const actionOutputs = {
    getUserData: getUserData
}

const connected = connect(mapStateToProps, actionOutputs)

export default connected(Private)