import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import BadgeHeader from '../components/BadgeHeader/BadgeHeader';
import BadgeContent from '../components/BadgeContent/BadgeContent';
import Modal from 'react-modal';
import Loading from "react-fullscreen-loading";
import {ToastsContainer, ToastsStore} from 'react-toasts';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class BadgeContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            badgeToken: '',
            badgeData: {},
            email: '',
            modalIsOpen: false,
            display: '',
            isLoading: true
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(e) {
        e.preventDefault();
        this.setState({ modalIsOpen: true });
    }    

    closeModal() {
        this.setState({ modalIsOpen: false });
    }    

    handleEmailChange = (e) => {
        this.setState({email: e.target.value})
        window.localStorage.setItem('email', e.target.value);
    }

    handleEmailSubmit = async(e) => {
        e.preventDefault()
        await axios
            .post(
                `/email`, {
                    email: this.state.email,
                    badgeToken: this.state.badgeToken,
                    badgeName: this.state.badgeData.name,
                    tags: this.state.badgeData.tags
                }
            )
            .then(res => {
                res.data.notification ? ToastsStore.error(res.data.notification) : ToastsStore.success('Claim request has been sent.');
                this.setState({
                    display: 'd-none'
                })
                this.closeModal();
            })
            .catch(err => {
                ToastsStore.error('There was an error, notify the admin about this.')
                this.closeModal();
                console.log(err)
            })
    }

    componentDidMount() {
        const { match: {params}} = this.props
        this.setState({
            badgeToken: params.badge_token,
            email: window.localStorage.getItem('email') || ''
        })
        axios
            .get(`/badges/${params.badge_token}`)
            .then(res => {
                this.setState({
                    badgeData: res.data.result[0],
                    isLoading: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div>
                <Loading loading={this.state.isLoading} background="#d8d8e6" loaderColor="#525dc7" />
                <Modal
                    isOpen={this.state.modalIsOpen}                    
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h1 className="h3 mb-3 font-weight-normal" ref={subtitle => this.subtitle = subtitle}>Claim this badge</h1>
                    <form onSubmit={this.handleEmailSubmit}>
                        <p>Badge Owner Text</p>
                        <input onChange={this.handleEmailChange} value={this.state.email} required type="email" className="form-control mb-3" placeholder="Email Address" />
                        <button className="btn btn-lg btn-primary btn-block search-button">Claim Badge</button>
                    </form>
                </Modal>
                <BadgeHeader imageSource={this.state.badgeData.image} buttonClass={this.state.display} badgeName={this.state.badgeData.name} badgeDescription={this.state.badgeData.description} openModal={this.openModal}/>
                <BadgeContent criteriaNarrative={this.state.badgeData.criteriaNarrative} criteriaURL={this.state.badgeData.criteriaUrl} />
                <ToastsContainer store={ToastsStore}/>
            </div>
        )
        
    }
}

export default withRouter(BadgeContainer);