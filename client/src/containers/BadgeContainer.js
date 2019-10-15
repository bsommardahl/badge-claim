import React, { Component } from 'react';
import axios from 'axios';
import BadgeHeader from '../components/BadgeHeader/BadgeHeader';
import BadgeContent from '../components/BadgeContent/BadgeContent';
import Modal from 'react-modal';

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
            modalIsOpen: false
        }
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(e) {
        e.preventDefault();
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    sendClaimEmail(e) {
        e.preventDefault()
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value})
    }

    componentDidMount() {
        const { match: {params}} = this.props
        this.setState({
            badgeToken: params.badge_token
        })
        axios
            .get(`/badge/${params.badge_token}`)
            .then(res => {
                this.setState({
                    badgeData: res.data.result[0]
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2 ref={subtitle => this.subtitle = subtitle}>Claim this badge</h2>
                    <form onSubmit={this.sendClaimEmail}>
                        <p>Badge Owner Text</p>
                        <input onChange={this.handleEmailChange} type="text" placeholder="Email Address" />
                        <button>Claim Badge</button>
                    </form>
                </Modal>
                <BadgeHeader imageSource={this.state.badgeData.image} badgeName={this.state.badgeData.name} badgeDescription={this.state.badgeData.description} openModal={this.openModal}/>

                <div className="container-fluid">
                    <BadgeContent criteriaNarrative={this.state.badgeData.criteriaNarrative} criteriaURL={this.state.badgeData.criteriaUrl} />
                </div>
            </div>
        )
        
    }
}

export default BadgeContainer;