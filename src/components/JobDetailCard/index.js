import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

const apiJobsStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobDetailCard extends Component {
  state = {
    apiJobsStatus: apiJobsStatusConstants.inProgress,
    jobDetails: [],
    similarJobDetails: [],
  }

  componentDidMount() {
    this.displayResults()
  }

  displayResults = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = [data.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachItem.title,
      }))
      const updatedSimilarData = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        employmentType: eachItem.employment_type,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      console.log(updatedSimilarData)
      this.setState({
        jobDetails: updatedData,
        similarJobDetails: updatedSimilarData,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onDisplayJobDetails = () => {
    const {jobDetails, similarJobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails[0]

    return (
      <div className="job-details-container">
        <div className="job-detail-card">
          <div className="company-details">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1>{title}</h1>
              <div className="display">
                <AiFillStar className="star" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details">
            <div className="display">
              <div className="display">
                <MdLocationOn className="icons" />
                <p>{location}</p>
              </div>
              <div className="display">
                <BsFillBriefcaseFill className="icons" />
                <p>{employmentType}</p>
              </div>
            </div>
            <div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div>
            <div className="display-v">
              <h1>Description</h1>
              <a href={companyWebsiteUrl} className="visit">
                Visit
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <h1>Skills</h1>
          <ul className="skill-container">
            {skills.map(eachItem => (
              <li key={eachItem.name} className="skill-item">
                <img src={eachItem.imageUrl} alt={eachItem.name} />
                <p>{eachItem.name}</p>
              </li>
            ))}
          </ul>

          <h1>Life at Company</h1>
          <div className="displays">
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-job-container">
          {similarJobDetails.map(eachItem => (
            <SimilarJobs jobDetails={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  onDisplayJobs = () => {
    const {apiJobsStatus} = this.state
    console.log(apiJobsStatus)

    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.onDisplayJobDetails()
      case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.onDisplayJobs()}
      </div>
    )
  }
}

export default JobDetailCard
