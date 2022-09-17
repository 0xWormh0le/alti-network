export const ServiceList = [
  'google',
  'youtube',
  'people',
  'tasks',
  'cloud-sql',
  'sheets',
  'apps-script',
  'presentations',
  'photos',
  'wallet',
  'cloud',
  'hangouts',
  'other',
  'groups',
  'gmail',
  'forms',
  'firebase',
  'drive',
  'docs',
  'cloudprint',
  'classroom',
  'webstore',
  'calendar',
  'analytics',
  'admin',
  'picasa'
] as const
type ServiceTuple = typeof ServiceList
export type Service = ServiceTuple[number]

interface ScopeCatalogMap {
  [x: string]: {
    description: string
    service: Service
  }
}

export const ScopeCatalog: ScopeCatalogMap = {
  openid: {
    description: 'Authenticate using OpenID Connect',
    service: 'google'
  },
  'https://www.googleapis.com/auth/youtubepartner': {
    description: 'View and manage your assets and associated content on YouTube',
    service: 'youtube'
  },
  'https://www.googleapis.com/auth/youtube.upload': {
    description: 'Manage your YouTube videos',
    service: 'youtube'
  },
  'https://www.googleapis.com/auth/youtube.tve': {
    description: 'Manage your YouTube videos',
    service: 'youtube'
  },
  'https://www.googleapis.com/auth/youtube-paid-content': {
    description: 'Manage your YouTube paid content',
    service: 'youtube'
  },
  'https://www.googleapis.com/auth/youtube': {
    description: 'Manage your YouTube account',
    service: 'youtube'
  },
  'https://www.googleapis.com/auth/userinfo.profile': {
    description: "View your personal info, including any personal info you've made publicly available",
    service: 'people'
  },
  'https://www.googleapis.com/auth/userinfo.email': {
    description: 'View your email address',
    service: 'people'
  },
  'https://www.googleapis.com/auth/userinfo#email': {
    description: 'View your email address',
    service: 'people'
  },
  'https://www.googleapis.com/auth/user.phonenumbers.read': {
    description: 'View your phone numbers',
    service: 'people'
  },
  'https://www.googleapis.com/auth/user.emails.read': {
    description: 'View your email addresses',
    service: 'people'
  },
  'https://www.googleapis.com/auth/user.birthday.read': {
    description: 'View your complete date of birth',
    service: 'people'
  },
  'https://www.googleapis.com/auth/urlshortener': {
    description: 'Manage your goo.gl short URLs',
    service: 'google'
  },
  'https://www.googleapis.com/auth/tasks': {
    description: 'Create, edit, organize, and delete all your tasks',
    service: 'tasks'
  },
  'https://www.googleapis.com/auth/sqlservice.admin': {
    description: 'Manage your Google SQL Service instances',
    service: 'cloud-sql'
  },
  'https://www.googleapis.com/auth/sqlservice': {
    description: 'View your Google SQL Service instances',
    service: 'cloud-sql'
  },
  'https://www.googleapis.com/auth/spreadsheets.readonly': {
    description: 'View your Google Spreadsheets',
    service: 'sheets'
  },
  'https://www.googleapis.com/auth/spreadsheets.currentonly': {
    description: 'View and manage sheets that this application has been installed in',
    service: 'sheets'
  },
  'https://www.googleapis.com/auth/spreadsheets': {
    description: 'View, edit, create, and delete your spreadsheets in Google Drive',
    service: 'sheets'
  },
  'https://www.googleapis.com/auth/siteverification': {
    description: 'Manage the list of sites and domains you control',
    service: 'google'
  },
  'https://www.googleapis.com/auth/script.webapp.deploy': {
    description: 'Deploy Google Apps Scripts Webapps',
    service: 'apps-script'
  },
  'https://www.googleapis.com/auth/script.storage': {
    description: 'View Google Apps Script Storage',
    service: 'apps-script'
  },
  'https://www.googleapis.com/auth/script.send_mail': {
    description: 'Send Mail via Google Apps Script',
    service: 'apps-script'
  },
  'https://www.googleapis.com/auth/script.scriptapp': {
    description: 'View and manage Google Apps Scripts',
    service: 'apps-script'
  },
  'https://www.googleapis.com/auth/script.locale': {
    description: 'View and manage Google Apps Script locale',
    service: 'apps-script'
  },
  'https://www.googleapis.com/auth/script.external_request': {
    description: 'Make external requests with Google Apps Script',
    service: 'apps-script'
  },
  'https://www.googleapis.com/auth/script.container.ui': {
    description: 'Change the layout of the ',
    service: 'apps-script'
  },
  'https://www.googleapis.com/auth/pubsub': {
    description: 'View and manage Pub/Sub topics and subscriptions',
    service: 'google'
  },
  'https://www.googleapis.com/auth/profile.emails.read': {
    description: 'View emails in your Google profile',
    service: 'people'
  },
  'https://www.googleapis.com/auth/presentations.currentonly': {
    description: 'View and manage presentations that this application has been installed in',
    service: 'presentations'
  },
  'https://www.googleapis.com/auth/presentations': {
    description: 'View and manage your Google Slides presentations',
    service: 'presentations'
  },
  'https://www.googleapis.com/auth/plus.profile.language.read': {
    description: 'View locales in your Google Plus profile',
    service: 'people'
  },
  'https://www.googleapis.com/auth/plus.profile.emails.read': {
    description: 'View email addresses listed in your Google Plus profile',
    service: 'people'
  },
  'https://www.googleapis.com/auth/plus.profile.agerange.read': {
    description: 'View the age listed in your Google Plus profile',
    service: 'people'
  },
  'https://www.googleapis.com/auth/plus.me': {
    description: 'View and manage your Google Plus profile',
    service: 'people'
  },
  'https://www.googleapis.com/auth/photoslibrary.readonly': {
    description: 'View photos in your Photos library',
    service: 'photos'
  },
  'https://www.googleapis.com/auth/photos': {
    description: 'View and manage your Photos library',
    service: 'photos'
  },
  'https://www.googleapis.com/auth/peopleapi.readonly': {
    description: 'View personal info of people in your organization',
    service: 'people'
  },
  'https://www.googleapis.com/auth/payments.video_purchase': {
    description: 'Purchase videos on your behalf',
    service: 'wallet'
  },
  'https://www.googleapis.com/auth/payments.make_payments': {
    description: 'Make payments on your behalf',
    service: 'wallet'
  },
  'https://www.googleapis.com/auth/monitoring.write': {
    description: 'Publish metric data to your Google Cloud projects',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/monitoring.read': {
    description: 'View monitoring data for all of your Google Cloud and third-party projects',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/monitoring': {
    description: 'View and write monitoring data for all of your Google and third-party Cloud and API projects',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/meetings': {
    description: 'View and create Meetings',
    service: 'hangouts'
  },
  'https://www.googleapis.com/auth/logging.write': {
    description: 'Submit log data for your projects',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/logging.read': {
    description: 'View log data for your projects',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/logging.admin': {
    description: 'Administrate log data for your projects',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/iam.test': {
    description: 'View, manage and test IAM configuration',
    service: 'other'
  },
  'https://www.googleapis.com/auth/hangout.participants': {
    description: 'View and manage Hangouts participants',
    service: 'hangouts'
  },
  'https://www.googleapis.com/auth/hangout.av': {
    description: 'View and manage Hangouts audio and video',
    service: 'hangouts'
  },
  'https://www.googleapis.com/auth/groups': {
    description: 'View and manage your Google Groups',
    service: 'groups'
  },
  'https://www.googleapis.com/auth/googletalk': {
    description: 'View and manage Hangouts messages',
    service: 'hangouts'
  },
  'https://www.googleapis.com/auth/gmail.settings.sharing': {
    description: 'Manage your sensitive mail settings, including who can manage your mail',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.settings.basic': {
    description: 'Manage your basic mail settings',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.send': {
    description: 'Send email on your behalf',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.readonly': {
    description: 'View your email messages and settings',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.modify': {
    description: 'View and modify but not delete your email',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.labels': {
    description: 'Manage mailbox labels',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.insert': {
    description: 'Insert mail into your mailbox',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.compose': {
    description: 'Manage drafts and send emails',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.addons.execute': {
    description: 'View and execute all Gmail add-ons',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.addons.current.message.readonly': {
    description: 'View emails in Gmail',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.addons.current.message.metadata': {
    description: 'View metadata of emails in Gmail',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.addons.current.message.action': {
    description: 'Send emails in Gmail',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gmail.addons.current.action.compose': {
    description: 'Create emails in Gmail',
    service: 'gmail'
  },
  'https://www.googleapis.com/auth/gerritcodereview': {
    description: 'Access Gerrit code review on your behalf',
    service: 'other'
  },
  'https://www.googleapis.com/auth/forms.currentonly': {
    description: 'View and manage forms that this application has been installed in',
    service: 'forms'
  },
  'https://www.googleapis.com/auth/forms': {
    description: 'View and manage forms',
    service: 'forms'
  },
  'https://www.googleapis.com/auth/flexible-api': {
    description: 'Access Flexible API on your behalf',
    service: 'other'
  },
  'https://www.googleapis.com/auth/firebase.messaging': {
    description: 'View and send firebase messages',
    service: 'firebase'
  },
  'https://www.googleapis.com/auth/firebase': {
    description: 'View and manage your firebase account',
    service: 'firebase'
  },
  'https://www.googleapis.com/auth/ediscovery': {
    description: 'Access E-Discovery on your behalf',
    service: 'other'
  },
  'https://www.googleapis.com/auth/drive.readonly.metadata': {
    description: 'View all Google Drive metadata',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.readonly': {
    description: 'View and download all your Google Drive files',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.photos.readonly': {
    description: 'View the photos, videos and albums in your Google Photos',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.metadata.readonly': {
    description: 'View metadata for files in your Google Drive',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.metadata': {
    description: 'View and manage metadata of files in your Google Drive',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.install': {
    description: 'Install applications into your Google Drive',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.file': {
    description: 'View and manage Google Drive files and folders that you have opened or created with this app',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.apps.readonly': {
    description: 'View applications in your Google Drive',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.appfolder': {
    description: 'View and manage its own folder(s) in your Google Drive',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.appdata': {
    description: 'View and manage its own configuration data in your Google Drive',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive.activity': {
    description: 'View activity in your Google Drive',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/drive': {
    description: 'View, edit, create, and delete all of your Google Drive files',
    service: 'drive'
  },
  'https://www.googleapis.com/auth/documents.readonly': {
    description: 'View your Google Docs documents',
    service: 'docs'
  },
  'https://www.googleapis.com/auth/documents.currentonly': {
    description: 'View your Google Docs documents in which this application is installed',
    service: 'docs'
  },
  'https://www.googleapis.com/auth/documents': {
    description: 'View and manage your Google Docs documents',
    service: 'docs'
  },
  'https://www.googleapis.com/auth/docs.test': {
    description: 'View your Google Docs documents',
    service: 'docs'
  },
  'https://www.googleapis.com/auth/docs': {
    description: 'View and edit your Google Docs documents',
    service: 'docs'
  },
  'https://www.googleapis.com/auth/devstorage.read_write': {
    description: 'Manage your data in Google Cloud Storage',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/devstorage.read_only': {
    description: 'View your data in Google Cloud Storage',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/devstorage.full_control': {
    description: 'Manage your data and permissions in Google Cloud Storage',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/contactstore.readonly': {
    description: 'View your contacts',
    service: 'people'
  },
  'https://www.googleapis.com/auth/contacts.readonly': {
    description: 'View and download your contacts',
    service: 'people'
  },
  'https://www.googleapis.com/auth/contacts': {
    description: 'View, edit, download, and permanently delete your contacts',
    service: 'people'
  },
  'https://www.googleapis.com/auth/compute.readonly': {
    description: 'View your Google Compute Engine resources',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/compute': {
    description: 'View and manage your Google Compute Engine resources',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/codejam': {
    description: 'Access Google Code Jam on your behalf',
    service: 'other'
  },
  'https://www.googleapis.com/auth/cloudprint': {
    description: 'Manage your Google Cloud Print services',
    service: 'cloudprint'
  },
  'https://www.googleapis.com/auth/cloud-platform.read-only': {
    description: 'View your data across Google Cloud Platform services',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/cloud-platform': {
    description: 'View and manage your data across Google Cloud Platform services',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/classroom.topics': {
    description: 'View, create, and edit topics in Google Classroom',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/classroom.rosters': {
    description: 'Manage your Google Classroom class rosters',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/classroom.profile.photos': {
    description: 'View the profile photos of people in your classes',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/classroom.profile.emails': {
    description: 'View the email addresses of people in your classes',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/classroom.guardianlinks.students': {
    description: 'View and manage guardians for students in your Google Classroom classes',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/classroom.coursework.students': {
    description:
      'Manage course work and grades for students in the Google Classroom classes you teach and view he course work and grades for classes you administer',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/classroom.coursework.me': {
    description: 'Manage your course work and view your grades in Google Classroom',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/classroom.courses': {
    description: 'Manage your Google Classroom classes',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/classroom.announcements': {
    description: 'View and manage announcements in Google Classroom',
    service: 'classroom'
  },
  'https://www.googleapis.com/auth/chromewebstore': {
    description: 'View and manage applications in the Chrome Web Store',
    service: 'webstore'
  },
  'https://www.googleapis.com/auth/carpool': {
    description: 'Access carpool on your behalf',
    service: 'other'
  },
  'https://www.googleapis.com/auth/carddav': {
    description: 'View and manage your contacts',
    service: 'people'
  },
  'https://www.googleapis.com/auth/calendar.settings.readonly': {
    description: 'View your calendar settings',
    service: 'calendar'
  },
  'https://www.googleapis.com/auth/calendar.readonly': {
    description: 'View your calendars',
    service: 'calendar'
  },
  'https://www.googleapis.com/auth/calendar.events.readonly': {
    description: 'View events on all your calendars',
    service: 'calendar'
  },
  'https://www.googleapis.com/auth/calendar.events': {
    description: 'View and edit events on all your calendars',
    service: 'calendar'
  },
  'https://www.googleapis.com/auth/calendar.addons.execute': {
    description: 'View and execute all calendar add-ons',
    service: 'calendar'
  },
  'https://www.googleapis.com/auth/calendar': {
    description: 'View, edit, share, and permanently delete all the calendars you can access using Google Calendar',
    service: 'calendar'
  },
  'https://www.googleapis.com/auth/bigquery.readonly': {
    description: 'View your data in Google BigQuery',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/bigquery.insertdata': {
    description: 'Insert data into Google BigQuery',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/bigquery': {
    description: 'View and manage your data in Google BigQuery',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/apps.order': {
    description: 'Manage users on your domain',
    service: 'google'
  },
  'https://www.googleapis.com/auth/apps.licensing': {
    description: 'View and manage G Suite licenses for your domain',
    service: 'google'
  },
  'https://www.googleapis.com/auth/apps.groups.settings': {
    description: 'View and manage the settings of a G Suite group',
    service: 'google'
  },
  'https://www.googleapis.com/auth/apps.groups.migration': {
    description: 'Manage messages in groups on your domain',
    service: 'google'
  },
  'https://www.googleapis.com/auth/android_video': {
    description: 'View and manage your applications deployed on Google App Engine',
    service: 'cloud'
  },
  'https://www.googleapis.com/auth/analytics.readonly': {
    description: 'View your Google Analytics data',
    service: 'analytics'
  },
  'https://www.googleapis.com/auth/analytics.edit': {
    description: 'Edit Google Analytics management entities',
    service: 'analytics'
  },
  'https://www.googleapis.com/auth/admin.reports.usage.readonly': {
    description: 'View usage reports for your G Suite domain',
    service: 'google'
  },
  'https://www.googleapis.com/auth/admin.reports.audit.readonly': {
    description: 'View audit reports for your G Suite domain',
    service: 'google'
  },
  'https://www.googleapis.com/auth/admin.directory.userschema.readonly': {
    description: 'View user schemas on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.userschema': {
    description: 'View and manage the provisioning of user schemas on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.user.security': {
    description: 'Manage data access permissions for users on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.user.readonly': {
    description: 'View users on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.user.alias': {
    description: 'View and manage user aliases on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.user': {
    description: 'View and manage the provisioning of users on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.rolemanagement': {
    description: 'Manage delegated admin roles for your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly': {
    description: 'View delegated admin roles for your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.resource.calendar': {
    description: 'View and manage the provisioning of calendar resources on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.orgunit': {
    description: 'View and manage organization units on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.notifications': {
    description: 'View and manage notifications received on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.group.readonly': {
    description: 'View groups on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.group.member.readonly': {
    description: 'View group subscriptions on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.group.member': {
    description: 'View and manage group subscriptions on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.group': {
    description: 'View and manage the provisioning of groups on your domain',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.domain.readonly': {
    description: 'View domains related to your customers',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.domain': {
    description: 'View and manage the provisioning of domains for your customers',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.device.mobile.action': {
    description: 'Manage your mobile devices by performing administrative tasks',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.device.mobile': {
    description: "View and manage your mobile devices' metadata",
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly': {
    description: "View your Chrome OS devices' metadata",
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.device.chromeos': {
    description: "View and manage your Chrome OS devices' metadata",
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.customer.readonly': {
    description: 'View customer related information',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.directory.customer': {
    description: 'View and manage customer related information',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/admin.datatransfer': {
    description: 'View and manage data transfers between users in your organization',
    service: 'admin'
  },
  'https://www.googleapis.com/auth/activity': {
    description: 'View the activity history of your Google apps',
    service: 'google'
  },
  'https://www.googleapis.com/auth/actions.builder': {
    description: 'View and manage Actions',
    service: 'google'
  },
  'https://www.googleapis.com/auth/accounts.reauth': {
    description: 'View and manage all accounts',
    service: 'google'
  },
  'https://www.google.com/m8/feeds': {
    description: 'View, edit, download, and permanently delete your contacts',
    service: 'people'
  },
  'https://www.google.com/hosted/services/v1.0/reports/ReportingData': {
    description: 'View and manage hosted services reports',
    service: 'google'
  },
  'https://www.google.com/calendar/feeds/': {
    description: 'View, edit, share, and permanently delete all the calendars you can access using Google Calendar',
    service: 'calendar'
  },
  'https://www.google.com/analytics/feeds/': {
    description: 'View and manage all of your Google Analytics data',
    service: 'analytics'
  },
  'https://www.google.com/accounts/OAuthLogin': {
    description: 'Login with your Google account',
    service: 'google'
  },
  'https://spreadsheets.google.com/feeds/': {
    description: 'View and manage all of your Google Sheets',
    service: 'sheets'
  },
  'https://sites.google.com/feeds': {
    description: 'View and manage all of your Google websites',
    service: 'google'
  },
  'https://picasaweb.google.com/data/': {
    description: 'View and manage all of your Picasa data',
    service: 'picasa'
  },
  'https://photos.googleapis.com/data/': {
    description: 'View and manage all of your Google Photos',
    service: 'photos'
  },
  'https://mail.google.com/': {
    description: 'View and manage all of your Gmail data',
    service: 'gmail'
  },
  'https://docs.googleusercontent.com/': {
    description: 'View and manage all of your Google Docs',
    service: 'docs'
  },
  'https://docs.google.com/feeds/': {
    description: 'View and manage all of your Google Docs',
    service: 'docs'
  },
  'https://apps-apis.google.com/a/feeds/user/': {
    description: 'View and manage all users in your G Suite account',
    service: 'google'
  },
  'https://apps-apis.google.com/a/feeds/policies/': {
    description: 'View and manage policies in your G Suite account',
    service: 'google'
  },
  'https://apps-apis.google.com/a/feeds/groups/': {
    description: 'View and manage all groups in your G Suite account',
    service: 'google'
  },
  'https://apps-apis.google.com/a/feeds/emailsettings/2.0/': {
    description: 'View and manage all email settings in your G Suite account',
    service: 'google'
  },
  'https://apps-apis.google.com/a/feeds/domain/': {
    description: 'View and manage all domains in your G Suite account',
    service: 'google'
  },
  'https://apps-apis.google.com/a/feeds/compliance/audit/': {
    description: 'View and manage all compliance data in your G Suite account',
    service: 'google'
  },
  'https://apps-apis.google.com/a/feeds/calendar/resource/': {
    description: 'View and manage all calendars in your G Suite account',
    service: 'google'
  },
  'https://apps-apis.google.com/a/feeds/alias/': {
    description: 'View and manage all email identities in your G Suite account',
    service: 'google'
  }
}
