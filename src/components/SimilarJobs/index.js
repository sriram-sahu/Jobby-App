import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobs = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails
  console.log(jobDetails)

  return (
    <div className="similar-job-card">
      <div className="company-name-details">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <h1 className="similar-heading">{title}</h1>
          <div className="display">
            <AiFillStar className="star" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <h1>Description</h1>
      <p>{jobDescription}</p>
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
    </div>
  )
}

export default SimilarJobs
