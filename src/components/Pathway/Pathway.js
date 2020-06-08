import React from 'react'
import {
    Link
  } from "react-router-dom";
import { createPathway } from './NodeGraph';
import './Pathway.css'
import {getPathways, getID, existPath, savePath, getUserEmail} from '../../FirebaseUtils'

class Pathway extends React.Component{
    constructor(props) {
        super(props);
        this.state = {pathway: null, userEmail: "", awarded: null}
    }

    componentDidMount(){
        const { match: {params}} = this.props
        const pathway = existPath(params.pathway_id);
        if(pathway == null) {
            getPathways().once('value', (snapshot) =>{
            this.setState({pathway:Object.values(snapshot.val()).filter(pathway => getID(pathway.completionBadge) === params.pathway_id)[0]})
        });
        }else{
            this.setState({pathway: pathway})
        }
        getUserEmail().then((user) => this.setState({userEmail: user.email}))
    }

    componentDidUpdate(prevProps, prevState) {
        const { match: {params}} = this.props
        if (prevState.pathway !== this.state.pathway) {
           //console.log('UPDATE', this.state);
           createPathway(this.state.pathway, this.state.userEmail, this.state.awarded)
           if(existPath(params.pathway_id) == null) {
               savePath(params.pathway_id, this.state.pathway)
           }
        }
      }

    render() {
        return (
            <div>
                <div>
                    <div className="badge-summary jumbotron">
                        <h1></h1>
                    </div>
                    <div 
                        className="pathway-div"
                        style={{textAlign: "center", overflow: "auto", height: "500px", width: "80%"}}
                    >
                        <div class="progress-bar">
                            <div class="progress-bar-value"></div>
                        </div>
                        <div id="my_dataviz">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Pathway;