import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Profile extends Component {
  state = {isLoading: '', profiles: ''}

  componentDidMount() {
    this.displayResult()
  }

  displayResult = async () => {
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const profileList = profile => ({
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      })
      const updatedData = profileList(data.profile_details)
      this.setState({profiles: updatedData, isLoading: true})
    }
  }

  showProfile = () => {
    this.displayResult()
  }

  render() {
    const {isLoading, profiles} = this.state
    const {name, profileImageUrl, shortBio} = profiles
    return isLoading ? (
      <div className="profile">
        <img className="profile-pic" src={profileImageUrl} alt="profile" />
        <h1 className="name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    ) : (
      <div className="retry">
        <button className="Retry" type="button" onClick={this.showProfile}>
          Retry
        </button>
      </div>
    )
  }
}

export default Profile
