import React from 'react'
import { createPathway } from './NodeGraph';
import './Pathway.css'
import {getPathways, getID, getUserEmail} from '../../../functions/FirebaseU/FirebaseUtils'

class Pathway extends React.Component{
    constructor(props) {
        super(props);
        this.state = {pathway: null, userEmail: "", awarded: null}
    }

    async componentDidMount(){
        const { match: {params}} = this.props;
        const user = await getUserEmail();
        this.setState({userEmail: user.email});
        getPathways().once('value', (snapshot) =>{
            this.setState({pathway:Object.values(snapshot.val()).filter(pathway => getID(pathway.completionBadge) === params.pathway_id)[0]})
            createPathway(this.state.pathway, this.state.userEmail, this.state.awarded, Object.values(snapshot.val()))
        });
    }

    render() {
        return (
            <div>
                <div>
                    <div className="badge-summary jumbotron">
                        <h1></h1>
                    </div>
                    <div style={{marginLeft: '10%'}}>
                        <ul>
                            <li style={{color:"#535dc8"}}>Not Awarded</li>
                            <li style={{color:"#ffdd00"}}>Completion Badge</li>
                            <li style={{color:"#13bf00"}}>Awarded</li>
                        </ul>
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