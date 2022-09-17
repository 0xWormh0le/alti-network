import React from 'react'
import './MarketingFooter.scss'

export const MarketingFooter: React.FC = () => {
  const baseUrl = 'https://altitudenetworks.com'
  return (
    <footer className='Footer'>
      <div className='Footer__container'>
        <div className='Footer__content'>
          <section className='Footer__section'>
            <h4>About</h4>
            <ul className='Footer__list'>
              <li className='Footer__list-item'>
                <a href={`${baseUrl}/about-us.html`}>Team</a>
              </li>
              <li className='Footer__list-item'>
                <a href={`${baseUrl}/careers.html`}>Careers</a>
              </li>
            </ul>
          </section>
          <section className='Footer__section'>
            <h4>Product</h4>
            <ul className='Footer__list'>
              <li className='Footer__list-item'>
                <a href={`${baseUrl}/how-it-works.html`} rel='noreferrer'>
                  How It Works
                </a>
              </li>
              <li className='Footer__list-item'>
                <a href={`${baseUrl}/offboarding`} rel='noreferrer' target='_blank'>
                  Offboarding
                </a>
              </li>
              <li className='Footer__list-item'>
                <a href='https://altnet.to/VulnDisclosureProgram' rel='noreferrer' target='_blank'>
                  Vulnerability
                  <br />
                  Disclosure Program
                </a>
              </li>
            </ul>
          </section>
          <section className='Footer__section'>
            <h4>Company</h4>
            <ul className='Footer__list'>
              <li className='Footer__list-item'>
                <a href='mailto:hello@altitudenetworks.com' rel='noreferrer' target='_blank'>
                  Contact
                </a>
              </li>
              <li className='Footer__list-item'>
                <a href={`${baseUrl}/privacy-policy.html`}>Privacy Policy</a>
              </li>
            </ul>
          </section>
        </div>
        <div>
          <h4 className='Footer__social-title'>Social</h4>
          <div className='Footer__social'>
            <a
              href='https://twitter.com/altitude'
              rel='noreferrer'
              target='_blank'
              aria-label='Connect with us in Twitter'
              className='Footer__social-item'>
              <img src='/socials/twitter.svg' alt='twitter' />
            </a>
            <a
              id='mailto-Footer'
              href='mailto:hello@altitudenetworks.com'
              rel='noreferrer'
              target='_blank'
              aria-label='Email'
              className='Footer__social-item'>
              <img src='/socials/email.svg' alt='email' />
            </a>
            <a
              href='https://www.linkedin.com/company/altitude-networks'
              rel='noreferrer'
              target='_blank'
              aria-label='Follow us in LinkedIn'
              className='Footer__social-item'>
              <img src='/socials/linkedin.svg' alt='linkedin' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MarketingFooter
