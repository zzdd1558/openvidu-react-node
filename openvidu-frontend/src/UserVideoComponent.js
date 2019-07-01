import React  , {Component} from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

class UserVideoComponent extends Component {

    constructor(props) {
        super(props)
    }

    getNicknameTag = () => {
        const streamManager = this.props.streamManager;
        return JSON.parse(`${streamManager.stream.connection.data}`.split(`%/%`)[0]).clientData
    }


    render(){
        const streamManager = this.props.streamManager;
        return (
            <div className="streamcomponent">
                {streamManager !== undefined ? (
                    <div >
                        <OpenViduVideoComponent streamManager={streamManager} />
                        <div><p>{this.getNicknameTag()}</p></div>
                    </div>
                ) : null}
            </div>
        );
    }

}
export default UserVideoComponent