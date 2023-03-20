import React from 'react';
import axios from 'axios';

function Querry(props) {
    return (
        <button onClick={() => querryMessage()}>Querry Message</button>
    );
}

function querryMessage() {
    axios.get('http://localhost:3001/query_msg').then(response => alert(response.data));
}

export default Querry;