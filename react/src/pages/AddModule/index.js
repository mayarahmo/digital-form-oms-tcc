﻿import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { Scrollchor } from 'react-scrollchor';
import api from '../../services/api';
import { Button, InputLabel, CircularProgress } from '@material-ui/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import './styles.css';

import { connect } from 'react-redux';

const styles = {
    Button: {
      margin: 24,
      marginBottom: 0
    }
};

function AddModule({user}) {

    const history = useHistory();

    const location = useLocation();

    const [formError, setFormError] = useState('')

    const [module, setModule] = useState([]);

    const [selectModule, setSelectModule] = useState('');

    const [creationDate, setCreationDate] = useState('');

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function convertToDate(somedate){
        return String(somedate.getFullYear()+
              "-"+(somedate.getMonth()+1)+
              "-"+somedate.getDate()+
              " "+somedate.getHours()+
              ":"+somedate.getMinutes()+
              ":"+somedate.getSeconds());
    }

    async function handleSubmit(e) {
       e.preventDefault();
       setLoading(true);
       setCreationDate(convertToDate(new Date()));
       const param = {
            userid : user[0].userid,    
            grouproleid : user[0].grouproleid,    
            hospitalunitid : user[0].hospitalunitid,    
            description: selectModule,
            moduleStatusID: "2", 
            questionnaireID: location.state.questionnaireID,
            lastModification: convertToDate(new Date()),
            creationDate: convertToDate(new Date())
       }
       console.log("request", param);
       
        const response = await api.post('/module/', param).catch( function (error) {
            setLoading(false);
            console.log(error)
            if(error.response.data.Message) {
                setError(error.response.data.Message);
            } else {
                setError(error.response.data.msgRetorno);
            }
        });

       if(response) {
            console.log("response.data.msgRetorno", response.data);
            setLoading(false);
            setSuccess(response.data.msgRetorno);
            history.goBack();
       }
    }

    useEffect(() => {
       async function getModules(){
           const response = await api.get('/modules/1').catch( function (error) {
                console.log(error)
                if(error.response.data.Message) {
                    setError(error.response.data.Message);
                } else {
                    setError(error.response.data.msgRetorno);
                }
            });

           if(response) {
                setModule(response.data);
                console.log("Módulos description", module);
            }
        }
        getModules();
    }, [])

    function handleChange(e) {
        setError('');
        //console.log(user)
        //this.setState({ defaultModule: e.target.value});
        setSelectModule(e.target.value);
        console.log("Valor selecionado", selectModule);
    }

    function handleBackButton(){
        history.goBack();
    }

    {
        selectModule === '' && setSelectModule("Formulário de Admissão")
    }

    return (
            <main className="container">
              <div className="mainNav" id="#topo">
                   <h2>{location.state.description}</h2>
                   <ArrowBackIcon className="ArrowBack" onClick={handleBackButton}/>
                   <Scrollchor to="#vodan_br"><ArrowUpwardIcon className="ArrowUp" /></Scrollchor>
                </div>
			    <div className="survey-details">
				    <p>Versão: {location.state.version}</p><br/>
				    <p className="padding-10">Status: {location.state.questionnaireStatus}</p><br/>
				    <p>Data de criação: {location.state.creationDate}</p><br/>
				    <p className="padding-10">Última modificação: {location.state.lastModification}</p><br/>
			    </div>
                <form className="module" onSubmit={handleSubmit}>
                    <div className="formGroup formGroup1">
                        <InputLabel>Selecione o tipo de formulário CRF:</InputLabel><br/>
                        <select name="selectModule" className="sel1" value={selectModule} onChange={handleChange}>
                           {
                                module.map(q => ( 
                                        <option key={q.crfFormsID} value={q.description}>{q.description}</option>
                                 ))
                             }
                        </select>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div className="submit-prontuario">
                        <span className="error">{ error }</span>
                        <span className="success">{ success }</span>
                        <br/>
                        <Button style={styles.Button} variant="contained" type="submit" color="primary" disabled={!module}>
                            { !loading &&
                                'Salvar'
                            }
                            { loading &&
                                <CircularProgress color="white"/>
                            }
                        </Button>
                    </div>
                 </form>
            </main>
    );
}

export default connect(state => ({ user: state.user }))(AddModule);