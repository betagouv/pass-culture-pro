import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import withLogin from '../hocs/withLogin'
import Form from '../layout/Form'
import Field from '../layout/Field'
import PageWrapper from '../layout/PageWrapper'
import SubmitButton from '../layout/SubmitButton'
import UploadThumb from '../layout/UploadThumb'
import { showNotification } from '../../reducers/notification'
import { apiUrl } from '../../utils/config'

class ProfilePage extends Component {

  handleSuccess = () => {
    const {
      showNotification
    } = this.props
    showNotification({
      type: 'success',
      text: 'Enregistré'
    })
  }

  render() {
    const {
      id,
      thumbPath,
    } = this.props.user || {}

    return (
      <PageWrapper name="profile" backTo={{path: '/accueil', label: 'Accueil'}}>
        <div className='section'>
          <h1 className='pc-title'>Profil</h1>
        </div>
        <Form className='section' name='editProfile' action='users/me' data={this.props.user} handleSuccess={this.handleSuccess}>
          <div className='field-group'>
            <Field name='publicName' label='Nom' required />
            <Field name='email' label='Email' required readOnly />
          </div>
          <div className="field is-grouped is-grouped-centered" style={{justifyContent: 'space-between'}}>
            <div className="control">
              <SubmitButton className='button is-primary is-medium'>
                Enregistrer
              </SubmitButton>
            </div>
            <div className='field'>
              <Field name='email' type='email' label='Email' required />
            </div>
          </div>
        </Form>
        <hr />
        <h1 className='title has-text-centered'>Avatar</h1>
        <div className='field'>
          <UploadThumb
            className='input'
            image={apiUrl(thumbPath)}
            collectionName='users'
            storeKey='thumbedUser'
            type='thumb'
            entityId={id}
            index={0}
            width={250}
            height={250}
            borderRadius={250}
           />
        </div>
      </PageWrapper>
    )
  }
}

export default compose(
  withLogin({ isRequired: true }),
  connect(
    state => ({
      user: state.user,
    }), {
      showNotification,
    }
  )
)(ProfilePage)
