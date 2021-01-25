import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from '../../services/api';

import './styles.css';

import { connect } from 'react-redux';

 function Modulos({user}) {
    const [responseQuantityModules, setResponseQuantityModules] = useState([]);

    useEffect( async () => {
        const { data } = await api.get('/form');
        setResponseQuantityModules(data)
    },[])

    const history = useHistory();

    const location = useLocation();

    return (
        <main className="container">
            <div>
                <header className="index">
                    { user[location.state.hospitalIndex].hospitalName } > <b>{ location.state.prontuario }</b>
                </header>
                <h2>Formulário de Registro de caso</h2>
            </div>
            <div className="modulos-list">
                {responseQuantityModules.map((item) => (
                    <div className="item" onClick={ () => {
                        history.push('/formulario', { modulo: item.crfFormsId })}}>
                        <h4>Módulo {item.crfFormsId}</h4>
                        <p> {item.description}</p>
                    </div>
                ))}   
            </div>
        </main>
    );
}

export default connect(state => ({ user: state.user }))(Modulos);