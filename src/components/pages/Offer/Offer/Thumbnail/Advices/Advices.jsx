import React, { useCallback } from 'react'

import { NBSP } from 'components/pages/Offer/Offer/Thumbnail/_constants'
import { ReactComponent as ArrowDown } from 'components/pages/Offer/Offer/Thumbnail/assets/arrow-down.svg'
import { ReactComponent as ArrowUp } from 'components/pages/Offer/Offer/Thumbnail/assets/arrow-up.svg'
import { ReactComponent as Download } from 'components/pages/Offer/Offer/Thumbnail/assets/download.svg'
import { ReactComponent as ExternalSite } from 'components/pages/Offer/Offer/Thumbnail/assets/external-site.svg'
import { ASSETS_URL } from 'utils/config'

const Advices = ({ hidden, setHidden }) => {
  const toggle = useCallback(() => {
    setHidden(!hidden)
  }, [hidden, setHidden])

  return (
    <div className="tna-advices">
      <button
        aria-pressed={!hidden}
        className={`tna-toggle ${hidden ? 'up' : 'down'}`}
        onClick={toggle}
        type="button"
      >
        {'Conseils pour votre image'}
        {hidden ? <ArrowDown /> : <ArrowUp />}
      </button>
      <div
        aria-hidden={hidden}
        className={hidden ? 'tna-hidden' : ''}
      >
        <p className="tna-teaser">
          {
            'Pour maximiser vos chances de réservations, choisissez avec soin l’image qui accompagne votre offre. Les ressources suivantes sont à votre disposition :'
          }
        </p>
        <p className="tna-title">
          {'Banque d’images libre de droits'}
        </p>
        <ul className="tna-links">
          <li>
            <a
              href="https://www.pexels.com/fr-fr/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalSite />
              {'Pexels'}
              <span className="tna-links-help">
                {`${NBSP}(nouvel onglet)`}
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://pixabay.com/fr/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalSite />
              {'Pixabay'}
              <span className="tna-links-help">
                {`${NBSP}(nouvel onglet)`}
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://www.shutterstock.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalSite />
              {'Shutterstock'}
              <span className="tna-links-help">
                {`${NBSP}(nouvel onglet)`}
              </span>
            </a>
          </li>
        </ul>
        <p className="tna-title">
          {'Gabarits'}
        </p>
        <ul className="tna-links tna-download-links">
          <li>
            <a href={`${ASSETS_URL}/PassCulture-accroche-template-20210128.psd`}>
              <Download />
              {'Gabarit Photoshop'}
              <span className="tna-links-help">
                {`${NBSP}(.psd, 414 Ko)`}
              </span>
            </a>
          </li>
          <li>
            <a href={`${ASSETS_URL}/PassCulture-accroche-template-20210128.eps`}>
              <Download />
              {'Gabarit Illustrator'}
              <span className="tna-links-help">
                {`${NBSP}(.eps, 1,7 Mo)`}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Advices