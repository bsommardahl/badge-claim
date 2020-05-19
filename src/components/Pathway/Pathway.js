import React from 'react'
import {
    Link
  } from "react-router-dom";
import { createPathway } from './NodeGraph';
import './Pathway.css'
import {logOut, getPathways, getID, existPath, savePath} from '../../FirebaseUtils'

const goto = (path) => {document.location.href = path;}

class Pathway extends React.Component{
    constructor(props) {
        super(props);
        this.state = {pathway: null}
    }

    componentDidMount(){
        const { match: {params}} = this.props
        const pathway = existPath(params.pathway_id);
        if(pathway == null) {
            getPathways().on('value', (snapshot) =>
            this.setState({pathway:snapshot.val().filter(pathway => getID(pathway.completionBadge) === params.pathway_id)[0]})
            );
        }else{
            this.setState({pathway: pathway})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { match: {params}} = this.props
        if (prevState.pathway !== this.state.pathway) {
           console.log('UPDATE');
           createPathway(this.state.pathway)
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
                        <Link className="btn btn-primary" to="/dashboard">Dashboard</Link>
                    </div>
                    <div 
                        className="pathway-div"
                        style={{textAlign: "center", overflow: "auto", height: "500px", width: "80%"}}
                        onLoad={() => console.log('LOADED')}
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