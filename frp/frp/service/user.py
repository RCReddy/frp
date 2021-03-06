# -*- coding: utf-8 -*-

from flask import session, g
from flask_login import current_user

from ..models import User, db

def update_profile(profile):
    """Update the profile.

    :param profile `forms.user.ProfileForm`: Form object with data.
    """
    user = current_user
    user.first_name = profile.first_name.data
    user.last_name = profile.last_name.data
    user.address = profile.address.data
    user.city = profile.city.data
    user.state = profile.state.data
    user.pin = profile.pin.data
    user.contact_number = profile.contact_number.data
    user.pan_number = profile.pan_number.data
    user.need_80g_certificate = profile.need_80g_certificate.data
    db.session.add(user)
    db.session.commit()
    return True
