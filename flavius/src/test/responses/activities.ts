import { FileActivityType } from 'types/common'

export const fileActivities: FileActivitiesResponse = {
  eventType: FileActivityType.DOWNLOAD,
  pageCount: 1,
  pageSize: 10,
  pageNumber: 1,
  events: [
    {
      eventId: 'kjfd3240lkjfl45ufdf',
      eventName: FileActivityType.DOWNLOAD,
      actor: {
        name: {
          fullName: 'Bobbie Hawaii',
          givenName: 'Bobbie',
          familyName: 'Hawaii'
        },
        primaryEmail: {
          address: 'bobbie@thoughtlabs.io'
        },
        providerId: '32423423534',
        jobTitle: 'Not Available',
        status: '',
        phone: '',
        avatar: {
          url: '',
          url_etag: ''
        }
      },
      datetime: 1634941627,
      createdAt: 1634941627,
      files: [
        {
          fileName: 'merit 2020.pdf',
          mimeType: 'txt',
          createdAt: 1634941627,
          createdBy: {
            name: {
              fullName: 'Bobbie Hawaii',
              givenName: 'Bobbie',
              familyName: 'Hawaii'
            },
            primaryEmail: {
              address: 'bobbie@thoughtlabs.io'
            },
            providerId: '32423423534',
            jobTitle: 'Not Available',
            status: '',
            phone: '',
            avatar: {
              url: '',
              url_etag: ''
            }
          },
          fileId: 'jsdjhfljdsl0',
          lastModified: 1634941627,
          parentFolder: {
            folderId: 'jlldksjf332',
            folderName: 'folderName'
          },
          path: 'root/merit 2020.pdf',
          description: 'internal file please do not share',
          size: 970,
          version: '923856940532'
        }
      ]
    }
  ]
}
