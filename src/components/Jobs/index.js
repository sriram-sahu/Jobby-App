import {Component} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Profile from '../Profile'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiJobsStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    radioInput: '',
    apiJobsStatus: apiJobsStatusConstants.inProgress,
    checkboxInputs: '',
    jobsData: [],
  }

  componentDidMount() {
    this.displayResults()
  }

  displayResults = async () => {
    const {checkboxInputs, radioInput, searchInput} = this.state
    this.setState({
      apiJobsStatus: apiJobsStatusConstants.inProgress,
    })
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobsData: updatedData,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.displayResults()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onDisplayJobsView = () => {
    const {jobsData} = this.state
    return (
      <div>
        {jobsData.length === 0 ? (
          <div className="no-jobs-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs</p>
          </div>
        ) : (
          <ul className="job-card-container">
            {jobsData.map(eachItem => (
              <JobCard jobDetails={eachItem} key={eachItem.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        data-testid="button"
        className="jobs-failure-button"
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  onDisplayJobs = () => {
    const {apiJobsStatus} = this.state
    console.log(apiJobsStatus)

    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.onDisplayJobsView()
      case apiJobsStatusConstants.failure:
        return this.renderFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.displayResults()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.displayResults()
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.displayResults)
  }

  jobDetailsShow = () => {
    this.displayResults()
  }

  render() {
    const {searchInput} = this.state
    return (
      <div>
        <Header />
        <div className="details-container">
          <div>
            <Profile />
            <hr className="hr-line" />
            <div className="employment-container">
              <h1>Type of Employment</h1>
              <ul className="list-container">
                {employmentTypesList.map(eachItem => (
                  <li key={eachItem.employmentTypeId}>
                    <input type="checkbox" id={eachItem.employmentTypeId} />
                    <label htmlFor={eachItem.employmentTypeId}>
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr className="hr-line" />
              <div className="employment-container">
                <h1>Salary Range</h1>
                <ul className="list-container">
                  {salaryRangesList.map(eachItem => (
                    <li key={eachItem.salaryRangeId}>
                      <input
                        type="radio"
                        id={eachItem.salaryRangeId}
                        name="radio"
                        onChange={this.onGetRadioOption}
                      />
                      <label htmlFor={eachItem.salaryRangeId}>
                        {eachItem.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="information-container">
            <div>
              <input
                className="search-input"
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.onDisplayJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
