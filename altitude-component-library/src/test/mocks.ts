import FilesAccessedResponse from './responses/filesAccessed.json'
import Immutable from 'immutable'

export const fileMock: IFile = {
  fileId: '1ghSxcB-ETCezb9odJLeHJufyFrBC_cG3',
  fileName: 'Quarterly Earnings',
  createdAt: 1504170378,
  lastModified: 1534150370,
  internalAccessCount: 1,
  externalAccessCount: 0,
  createdBy: {
    personId: 'test@email.com',
    email: 'test@email.com',
    firstName: 'Test',
    lastName: 'User',
    avatar: '',
    accessCount: 0,
    riskCount: 0,
    otherEmails: [],
    internal: true,
    internalEmailCount: 1,
    externalEmailCount: 1
  },
  mimeType: 'doc',
  parentFolder: null,
  linkVisibility: 'user',
  internalAccessList: [
    {
      firstName: 'Test',
      lastName: 'User',
      personId: 'test@email.com',
      email: 'test@email.com',
      avatar: '',
      accessCount: 0,
      riskCount: 0,
      otherEmails: [],
      internal: true,
      internalEmailCount: 1,
      externalEmailCount: 1
    }
  ],
  externalAccessList: [
    {
      firstName: '',
      lastName: '',
      personId: '',
      email: '',
      avatar: '',
      accessCount: 0,
      riskCount: 0,
      otherEmails: [],
      internal: true,
      internalEmailCount: 1,
      externalEmailCount: 1
    }
  ],
  app: 'GDrive'
}

export const filesResponse = {
  files: [
    {
      file: { fileId: '14JCrTBhf4GRN1ArUwDOF9CXfv2mQbZyW', fileName: 'emptyfile5847' },
      createdBy: {
        personId: 'test@email.com',
        email: 'test@email.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: ''
      },
      createdAt: 1556921078,
      lastModified: 1556921078,
      linkVisibility: 'user'
    },
    {
      file: { fileId: '1of2kbpr9fV-6LPo9jvDevtu5RGEt6dnZ', fileName: 'emptyfile4995' },
      createdBy: {
        personId: 'test@email.com',
        email: 'test@email.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: ''
      },
      createdAt: 1556921078,
      lastModified: 1556921078,
      linkVisibility: 'user'
    }
  ],
  pageSize: 10,
  pageNumber: 1,
  pageCount: 1068,
  riskId: null,
  orderBy: 'lastModified',
  sort: 'desc'
}

export const fileEventsResponse = {
  events: [
    {
      actor: {
        personId: 'test@email.com',
        email: 'test@email.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: '',
        accessCount: 0,
        riskCount: 0,
        otherEmails: []
      },
      files: [
        {
          fileId: '14JCrTBhf4GRN1ArUwDOF9CXfv2mQbZyW',
          fileName: 'emptyfile5847'
        }
      ],
      datetime: 1563406383,
      eventName: 'change_document_access_scope',
      destinationFolderTitle: null,
      eventDescription: 'unknown',
      eventId: '8564501571001731437',
      exposure: 'external',
      ipAddress: '35.155.135.135',
      membershipChangeType: null,
      newValue: 'none',
      newVisibility: 'shared_externally',
      oldValue: 'can_edit',
      oldVisibility: 'shared_externally',
      sourceFolderTitle: null,
      targetPeople: []
    },
    {
      actor: {
        personId: 'test@email.com',
        email: 'test@email.com',
        firstName: 'Test',
        lastName: 'User',
        avatar: '',
        accessCount: 0,
        riskCount: 0,
        otherEmails: []
      },
      files: [
        {
          fileId: '14JCrTBhf4GRN1ArUwDOF9CXfv2mQbZyW',
          fileName: 'emptyfile5847'
        }
      ],
      datetime: 1563406383,
      eventName: 'change_document_access_scope',
      destinationFolderTitle: null,
      eventDescription: 'unknown',
      eventId: '8564501571001731437',
      exposure: 'external',
      ipAddress: '35.155.135.135',
      membershipChangeType: null,
      newValue: 'none',
      newVisibility: 'shared_externally',
      oldValue: 'can_edit',
      oldVisibility: 'shared_externally',
      sourceFolderTitle: null,
      targetPeople: []
    }
  ],
  startTime: null,
  endTime: null,
  pageSize: 10,
  pageNumber: 1,
  pageCount: 4,
  sort: 'desc',
  orderBy: 'datetime'
}

export const risksResponse = {
  risks: [
    {
      riskId: '8c488709dbae483aa0a3576b6fd6589e',
      owner: {
        personId: 'bobbie@thoughtlabs.io',
        email: 'bobbie@thoughtlabs.io',
        firstName: 'Bobbie',
        lastName: 'Hawaii',
        avatar: '',
        accessCount: 0,
        riskCount: 0,
        otherEmails: []
      },
      creator: {
        personId: 'risk_creator@thoughtlabs.io',
        email: 'risk_creator@thoughtlabs.io',
        lastName: 'Creator',
        firstName: 'Risk',
        avatar: '',
        accessCount: 0,
        riskCount: 0,
        otherEmails: []
      },
      datetime: 1566244504,
      riskTypeId: 1020,
      severity: 7,
      fileName: 'ptinpoly.c',
      app: 'GDrive',
      fileId: '1_4sZI4rBgwnC2VDUKCSLFHMJc77oWEI2',
      fileCount: 1,
      riskDescription: 'File Shared by Link - Externally Accessible',
      riskTarget: []
    }
  ],
  startTime: null,
  endTime: null,
  pageSize: 10,
  pageNumber: 1,
  pageCount: 49,
  riskCount: 486,
  personId: 'bobbie@thoughtlabs.io',
  fileId: null,
  orderBy: 'severity',
  sort: 'desc',
  riskTypeIds: []
}

export const spotlightEventsResponse = {
  events: [
    {
      targetPeople: [
        {
          email: null,
          personId: null,
          firstName: null,
          lastName: null,
          avatar: null,
          accessCount: 0,
          riskCount: 0,
          otherEmails: []
        }
      ],
      severity: '0',
      eventId: '-1958838234746594119',
      eventName: 'add_to_folder',
      eventDescription: 'Unknown',
      datetime: 1566824597,
      files: [
        {
          fileId: '1e6rIBS0RKGGEQzsO_APOvJ64EuC-ovmP',
          fileName: 'J1566824596',
          createdBy: {
            personId: null,
            email: null,
            firstName: null,
            lastName: null,
            avatar: null,
            accessCount: 0,
            riskCount: 0,
            otherEmails: []
          }
        }
      ]
    }
  ],
  startTime: null,
  endTime: null,
  pageSize: 10,
  pageNumber: 1,
  pageCount: 4,
  sort: 'desc',
  orderBy: 'datetime'
}

export const sensitivePhraseMock: SensitivePhrase[] = [
  {
    id: 1,
    phrase: 'internal',
    exact: true
  },
  {
    id: 2,
    phrase: 'external',
    exact: false
  },
  {
    id: 3,
    phrase: 'comp',
    exact: true
  },
  {
    id: 4,
    phrase: 'earnings',
    exact: false
  },
  {
    id: 5,
    phrase: 'financial',
    exact: true
  }
]

export const authenticatedUser: AuthenticatedUser = {
  id: 'us-west-2:cb227af6-fed4-4742-ba6f-da5ccc931260',
  username: 'testuser1@thoughtlabs.io',
  attributes: {
    sub: 'ad12fb78-dede-4c00-85a4-605442cff8dd',
    name: 'Test User1',
    phoneNumber: '+15555555555',
    email: 'testuser1@thoughtlabs.io',
    email_verified: true,
    phoneNumber_verified: true
  }
}

export const application: Application = {
  name: 'Hello Sign',
  id: 'aaaaaaaa',
  marketplaceURI: 'http://xxx.yyy',
  imageURI: 'https://via.placeholder.com/150',
  grants: [
    'https://www.googleapis.com/auth/gmail.settings.sharing',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
  ]
}

export const personStat: PersonStatistics = {
  labels: [
    1527811200,
    1530403200,
    1533081600,
    1535760000,
    1538352000,
    1541030400,
    1543622400,
    1546300800,
    1548979200,
    1551398400,
    1554076800,
    1556668800
  ],
  series: {
    appDownloads: [8, 0, 0, 0, 0, 2, 0, 0, 0, 18, 0, 0],
    personDownloads: [8, 0, 0, 0, 0, 2, 0, 0, 0, 18, 0, 0],
    collaborators: [3, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0],
    filesSharedWith: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    allActivity: [98, 22, 29, 1, 0, 74, 0, 11, 23, 97, 52, 0],
    risks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0],
    filesSharedBy: [3, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0],
    filesAccessible: [],
    atRiskFilesOwned: [],
    risksCreated: []
  }
}

export const applicationStat = {
  labels: [
    1548979200,
    1551398400,
    1554076800,
    1556668800,
    1559347200,
    1561939200,
    1564617600,
    1567296000,
    1569888000,
    1572566400,
    1575158400
  ],
  series: {
    authorizedBy: [5000, 4000, 1500, 0, 2000, 11000, 12000, 10000, 0, 11000, 12000], // all people who have authorized the app at each timestamp
    fileDownloads: [1000, 3000, 2500, 1000, 4000, 10000, 8000, 14000, 2000, 4000, 2000], // files the app can access at each timestamp
    associatedRisks: [3000, 1000, 3500, 3000, 1000, 8000, 7000, 8000, 4500, 7000, 8000] // risks associated with the app at each timestamp
  },
  tileInfo: {
    totalSensitive: 130, // number of files that are sensitive in the latest time slice in the series, for displaying the percentage that are sensitive
    totalEmails: 100, // total employees for displaying the percentage that have authorized this application
    currentRisks: 1,
    currentAuthorizedBy: 90,
    severities: [0, 10, 2, 2, 1]
  }
}

export const peopleResponse = JSON.parse(
  '{"people": [{"personId": "amir@thoughtlabs.io", "email": "amir@thoughtlabs.io", "firstName": "Amir", "lastName": "Kavousian", "avatar": "avatar", "internal": true, "internalEmailCount": 0, "externalEmailCount": 0, "accessCount": 0, "riskCount": 0, "otherEmails": []}, {"personId": "bobbie@thoughtlabs.io", "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "avatar": "avatar", "internal": true, "internalEmailCount": 0, "externalEmailCount": 0, "accessCount": 0, "riskCount": 0, "otherEmails": []}, {"personId": "johannes@thoughtlabs.io", "email": "johannes@thoughtlabs.io", "firstName": "Johannes", "lastName": "Freden", "avatar": "avatar", "internal": true, "internalEmailCount": 0, "externalEmailCount": 0, "accessCount": 0, "riskCount": 0, "otherEmails": []}, {"personId": "LisaAndrews@thoughtlabs.io", "email": "LisaAndrews@thoughtlabs.io", "firstName": "Lisa", "lastName": "Andrews", "avatar": "avatar", "internal": true, "internalEmailCount": 0, "externalEmailCount": 0, "accessCount": 0, "riskCount": 0, "otherEmails": []}, {"personId": "michael@thoughtlabs.io", "email": "michael@thoughtlabs.io", "firstName": "Michael", "lastName": "Coates", "avatar": "avatar", "internal": true, "internalEmailCount": 0, "externalEmailCount": 0, "accessCount": 0, "riskCount": 0, "otherEmails": []}, {"personId": "andy@thoughtlabs.io", "email": "andy@thoughtlabs.io", "firstName": "Andy", "lastName": "Z", "avatar": "avatar", "internal": true, "internalEmailCount": 0, "externalEmailCount": 0, "accessCount": 0, "riskCount": 0, "otherEmails": []}, {"personId": "joe@thoughtlabs.io", "email": "joe@thoughtlabs.io", "firstName": "joe", "lastName": "f", "avatar": "avatar", "internal": true, "internalEmailCount": 0, "externalEmailCount": 0, "accessCount": 0, "riskCount": 0, "otherEmails": []}], "pageSize": 10, "pageNumber": 1, "pageCount": 1, "domain": null, "riskId": null, "sort": "desc"}'
)

export const fileDownloadsResponse = JSON.parse(
  '{"endTime": null, "eventType": "downloads", "events": [{"datetime": 1576627720, "eventDescription": "Unknown", "eventId": "1373419702667885644", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "19SqoY_J69I-zSD78xWcEGnZGuMKwUY0p", "fileName": "M1576458025.2600327g1576458025.2600327F1576458025.2600327m1576458025.2600327v1576458025.2600327C1576458025.2600327A1576458025.2600327j1576458025.2600327W1576458025.2600327p"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627720, "eventDescription": "Unknown", "eventId": "5793701614396163968", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "1TcaKulPQetvdW1dPCLLt-9QYPl7ewTVd", "fileName": "a1576450824.9299188U1576450824.9299188Q1576450824.9299188l1576450824.9299188d1576450824.9299188B1576450824.9299188D1576450824.9299188f1576450824.9299188i1576450824.9299188M"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627720, "eventDescription": "Unknown", "eventId": "-7693643823377407636", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "1i33sJahskLRCGgrF2uGv3wa8lgS66BJr", "fileName": "e1576454425.3118212I1576454425.3118212J1576454425.3118212E1576454425.3118212s1576454425.3118212C1576454425.3118212O1576454425.3118212y1576454425.3118212D1576454425.3118212d"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627720, "eventDescription": "Unknown", "eventId": "-7997751163021945351", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "1u2uDgbhVWNBJ7KKIysmWl-1ku77OGB4u", "fileName": "N1576447225.0742872q1576447225.0742872c1576447225.0742872d1576447225.0742872T1576447225.0742872w1576447225.0742872E1576447225.0742872Q1576447225.0742872I1576447225.0742872c"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627719, "eventDescription": "Unknown", "eventId": "5445485637205810586", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "1fvKOI7-8dZBiYpJWWinDU3rsk1IrcF-5", "fileName": "A1576468825.3130538J1576468825.3130538A1576468825.3130538X1576468825.3130538w1576468825.3130538v1576468825.3130538x1576468825.3130538Q1576468825.3130538C1576468825.3130538t"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627719, "eventDescription": "Unknown", "eventId": "-2625244455799435032", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "1taGogeUt3UpXJ_FtGr7Vn2NqI68z7zpI", "fileName": "l1576472425.4969134M1576472425.4969134j1576472425.4969134M1576472425.4969134q1576472425.4969134U1576472425.4969134U1576472425.4969134W1576472425.4969134X1576472425.4969134D"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627719, "eventDescription": "Unknown", "eventId": "-4610633587307334415", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "1hV_UPrVcn7i3cRRjzfzCXTORv7wQlmzH", "fileName": "y1576465225.3512406Z1576465225.3512406l1576465225.3512406v1576465225.3512406c1576465225.3512406k1576465225.3512406W1576465225.3512406U1576465225.3512406w1576465225.3512406N"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627719, "eventDescription": "Unknown", "eventId": "-6923590601340166550", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "1sQFU55c3NCzxBM90Z9yTr4TVFEMNP-wJ", "fileName": "t1576461625.4546301x1576461625.4546301s1576461625.4546301K1576461625.4546301T1576461625.4546301F1576461625.4546301A1576461625.4546301Z1576461625.4546301w1576461625.4546301a"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627718, "eventDescription": "Unknown", "eventId": "2166379470289245865", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "1Ri3HAFDqfZhvEV3_fWo1abWY1SIZn7-i", "fileName": "x1576483226.0124354q1576483226.0124354K1576483226.0124354p1576483226.0124354b1576483226.0124354y1576483226.0124354O1576483226.0124354X1576483226.0124354z1576483226.0124354t"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}, {"datetime": 1576627718, "eventDescription": "Unknown", "eventId": "5790502388770981004", "eventName": "download", "files": [{"createdBy": {"accessCount": 0, "avatar": null, "email": "bobbie@thoughtlabs.io", "firstName": "Bobbie", "lastName": "Hawaii", "otherEmails": [], "personId": "bobbie@thoughtlabs.io", "riskCount": 0}, "fileId": "18Euy6EDgIhxZ-plDFUuNUfQ8NX3gCuUq", "fileName": "K1576476025.192443k1576476025.192443g1576476025.192443u1576476025.192443c1576476025.192443R1576476025.192443s1576476025.192443H1576476025.192443m1576476025.192443v"}], "severity": "0", "targetPeople": [{"accessCount": 0, "avatar": null, "email": null, "firstName": null, "lastName": null, "otherEmails": [], "personId": null, "riskCount": 0}]}], "orderBy": "datetime", "pageCount": 307, "pageNumber": 1, "pageSize": 10, "sort": "desc", "startTime": null}'
)

export const filesAccessedResponse = FilesAccessedResponse

export const permissionsResponse = JSON.parse(
  '{"orderBy": "permissions_id", "pageCount": 1, "pageCountCacheTTL": 3600, "pageCountLastUpdated": 1603938203, "pageNumber": 1, "pageSize": 10, "permissions": [{"discoverable": false, "permissionEmailAddress": "ahead@orca.org", "permissionId": "07386716351715372050", "role": "write", "shared": "external", "type": "user"}, {"discoverable": false, "permissionEmailAddress": "ahead@bombast.org", "permissionId": "02767160992252023785", "role": "write", "shared": "internal", "type": "user"}], "permissionsCount": 2, "sort": "DESC"}'
)

export const previewChartData = {
  labels: [1527811200, 1530403200, 1533081600, 1554076800, 1556668800],
  series: [
    [8, 0, 0, 0, 0, 2, 0, 0, 0, 18, 0, 0],
    [8, 0, 0, 0, 0, 2, 0, 0, 0, 18, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0]
  ]
}

export const tilesData = JSON.parse(
  '{"highestRiskFile": {"count": 1, "file": {"createdAt": "Oct 13 2020", "createdBy": {"accessCount": 0, "avatar": "avatar", "email": "dev-01@g-drive-usage-monitoring.iam.gserviceaccount.com", "externalEmailCount": 1, "firstName": "", "internal": false, "internalEmailCount": 0, "lastName": "", "otherEmails": [], "personId": "dev-01@g-drive-usage-monitoring.iam.gserviceaccount.com", "riskCount": 0}, "externalAccessCount": 1, "externalAccessList": [], "fileId": "0Bw5MKqz8XL31c3RhcnRlcl9maWxl", "fileName": "Getting started", "internalAccessCount": 0, "internalAccessList": [], "lastModified": "Oct 13 2020", "linkVisibility": "external"}}, "mostAtRiskFilesOwned": {"count": 9, "person": {"accessCount": 0, "avatar": "avatar", "email": "dev-01@g-drive-usage-monitoring.iam.gserviceaccount.com", "externalEmailCount": 1, "firstName": "", "internal": false, "internalEmailCount": 0, "lastName": "", "otherEmails": [], "personId": "dev-01@g-drive-usage-monitoring.iam.gserviceaccount.com", "riskCount": 0}}, "mostExternalAccess": {"count": 1977, "person": {"accessCount": 0, "avatar": "avatar", "email": "jfatora@gmail.com", "externalEmailCount": 1, "firstName": "", "internal": false, "internalEmailCount": 0, "lastName": "", "otherEmails": [], "personId": "jfatora@gmail.com", "riskCount": 0}}, "mostRisksCreated": {"count": 2, "person": {"accessCount": 0, "avatar": "avatar", "email": "michael@altitudenetworks.com", "externalEmailCount": 1, "firstName": "Michael", "internal": false, "internalEmailCount": 1, "lastName": "Coates", "otherEmails": [{"accessCount": 0, "email": "michael@thoughtlabs.io", "internal": true, "riskCount": 0}], "personId": "michael@altitudenetworks.com", "riskCount": 0}}}'
)

export const statsData = JSON.parse(
  '{"stats": [{"count": 1, "riskTypeId": 10, "severity": 5}, {"count": 1, "riskTypeId": 1020, "severity": 8}, {"count": 1, "riskTypeId": 2000, "severity": 5}]}'
)

export const profileResponse = {
  accessCount: 6,
  avatar: 'avatar',
  email: 'michael@altitudenetworks.com',
  externalEmailCount: 1,
  firstName: 'Michael',
  internal: false,
  internalEmailCount: 1,
  lastName: 'Coates',
  otherEmails: [
    {
      accessCount: 11146,
      email: 'michael@thoughtlabs.io',
      internal: true,
      permissionsLastDeleted: null,
      riskCount: 0
    }
  ],
  permissionsLastDeleted: null,
  personId: 'michael@altitudenetworks.com',
  riskCount: 0
}

export const appResponse = JSON.parse(
  '{"grants": ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/drive.activity", "https://www.googleapis.com/auth/activity", "https://www.googleapis.com/auth/drive.file", "openid", "https://www.googleapis.com/auth/calendar.readonly", "https://www.googleapis.com/auth/plus.me", "https://www.googleapis.com/auth/drive.readonly", "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/admin.directory.user.readonly", "https://www.googleapis.com/auth/userinfo.profile"], "id": "19570130570", "imageURI": "https://lh3.googleusercontent.com/-l_O1PMEJxzA/XEAD-o6j8wI/AAAAAAAAAG8/wsDm_C1DqnwzfVu_ByQ3Z8xxZo7Zs6D9ACLcBGAs/s400/128x128.png", "marketplaceURI": 1, "name": "Slack"}'
)

export const fileResponse = JSON.parse(
  '{"createdAt": 1573051338, "createdBy": {"accessCount": 0, "avatar": "avatar", "email": "ahead@bombast.org", "firstName": "Prowler", "lastName": "Accrue", "otherEmails": [], "personId": "ahead@bombast.org", "riskCount": 0}, "externalAccessCount": 1, "externalAccessList": [{"accessCount": 0, "avatar": "avatar", "email": "ahead@orca.org", "firstName": "Beehive", "lastName": "Physique", "otherEmails": [], "permissionId": "07386716351715372050", "personId": "ahead@orca.org", "riskCount": 0, "role": "writer"}], "fileId": "11nKrCMT0M-LlErehXxmnifZR8B7tIsLGbcmn3gQxFYE", "fileName": "acme-escape-geiger-snowcap", "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.spreadsheet", "internalAccessCount": 1, "internalAccessList": [{"accessCount": 0, "avatar": "avatar", "email": "ahead@bombast.org", "firstName": "Beehive", "lastName": "Physique", "otherEmails": [], "permissionId": "02767160992252023785", "personId": "ahead@bombast.org", "riskCount": 0, "role": "owner"}], "lastIngested": 1588065256, "lastModified": 1573051391, "linkVisibility": "user", "md5Checksum": null, "mimeType": "spreadsheet", "sharedToDomains": [{"name": "orca.org", "permissionId": "07386716351715372050"}, {"name": "bombast.org", "permissionId": "02767160992252023785"}], "trashed": false}'
)

export const badIpData = {
  message: 'No data for this IP'
}

export const goodIpData = {
  country_name: 'United States',
  organization: 'Amazon',
  city: 'Willard',
  state_prov: 'Ohio',
  longitude: 200,
  latitude: 200
}

export const ipNoMap = {
  country_name: 'United States',
  organization: 'Amazon',
  city: 'Los Angeles',
  state_prov: 'California',
  longitude: -120,
  latitude: -120
}

export const risksData = {
  data: {
    files: [
      {
        createdAt: null,
        createdBy: {
          accessCount: 0,
          avatar: null,
          email: 'pulkit@thoughtlabs.io',
          firstName: null,
          lastName: null,
          otherEmails: [],
          personId: 'pulkit@thoughtlabs.io',
          riskCount: 0
        },
        externalAccessCount: 0,
        externalAccessList: [],
        fileId: '1dMsL9C8c49LXCQW5JyyyQ5bkSzaWiuVaBxjzVKILzaw',
        fileName: null,
        iconUrl: null,
        internalAccessCount: 0,
        internalAccessList: [],
        lastIngested: 1603170608,
        lastModified: null,
        linkVisibility: 'none',
        md5Checksum: null,
        mimeType: null,
        sharedToDomains: [],
        trashed: false
      },
      {
        createdAt: null,
        createdBy: {
          accessCount: 0,
          avatar: null,
          email: 'pulkit@thoughtlabs.io',
          firstName: null,
          lastName: null,
          otherEmails: [],
          personId: 'pulkit@thoughtlabs.io',
          riskCount: 0
        },
        externalAccessCount: 0,
        externalAccessList: [],
        fileId: '1hJC48kqutp_8ACpKapJFbkb6vGtul_RCHnK2JGfBAE8',
        fileName: null,
        iconUrl: null,
        internalAccessCount: 0,
        internalAccessList: [],
        lastIngested: 1603151778,
        lastModified: null,
        linkVisibility: 'none',
        md5Checksum: null,
        mimeType: null,
        sharedToDomains: [],
        trashed: false
      }
    ],
    orderBy: 'lastModified',
    pageCount: 1,
    pageCountCacheTTL: 3600000,
    pageCountLastUpdated: 1603378897,
    pageNumber: 1,
    pageSize: 10,
    riskId: '9be1f616c26c92be69dfdcaa981d543f9f8f19da',
    sort: 'DESC'
  }
}

export const sensitiveFileData = {
  singleValueProps: {
    value: Immutable.Map({
      fileCount: 4,
      riskId: '"c1f87796f79f0d283b9233673a430b40a7ed3e7a"',
      riskTypeId: 1020,
      sensitivePhrases: Immutable.Map({
        ccNum: 6,
        ssn: 3,
        sensitiveKeywords: Immutable.List([
          Immutable.Map({
            count: 8,
            keyword: 'acme'
          }),
          Immutable.Map({
            count: 4,
            keyword: 'drainage'
          })
        ])
      })
    }),
    hasSensitiveContent: true
  },
  singleValuePropsNoPhrases: {
    value: Immutable.Map({
      fileCount: 4,
      riskId: '"c1f87796f79f0d283b9233673a430b40a7ed3e7a"',
      riskTypeId: 1020,
      sensitivePhrases: Immutable.Map({
        ccNum: 6,
        ssn: 3,
        sensitiveKeywords: Immutable.List()
      })
    }),
    hasSensitiveContent: true
  },
  singleValuePropsPhrasesOnly: {
    value: Immutable.Map({
      fileCount: 4,
      riskId: '"c1f87796f79f0d283b9233673a430b40a7ed3e7a"',
      riskTypeId: 1020,
      sensitivePhrases: Immutable.Map({
        ccNum: 0,
        ssn: 0,
        sensitiveKeywords: Immutable.List([
          Immutable.Map({
            count: 8,
            keyword: 'acme'
          }),
          Immutable.Map({
            count: 4,
            keyword: 'drainage'
          })
        ])
      })
    }),
    hasSensitiveContent: true
  },
  multiValueProps: {
    value: Immutable.Map({
      fileCount: 4,
      riskTypeId: 1020,
      riskId: '"rbquqasdf2222273a430b40a7ed3e7a"',
      sensitivePhrases: Immutable.Map({
        ccNumFileCount: 5,
        sensitiveKeywordsFileCount: 3,
        ssnFileCount: 6
      })
    }),
    hasSensitiveContent: true
  }
}

export const ActorData = {
  actorProps: {
    value: Immutable.Map({
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@email.com',
      personId: '12345'
    })
  }
}

export const riskFile = {
  ...fileMock,
  ...{
    parentFolder: {
      folderId: '1NOw9DRtp_Z0HqvCUGJhn51ciFxKVLSfA',
      folderName: '25sensitivefiles'
    }
  }
}

export const FileContentInspectionData = {
  propsWithRisks: {
    sensitivePhrases: {
      ccNum: 6,
      ssn: 3,
      sensitiveKeywords: [
        {
          count: 4,
          keyword: 'merit'
        },
        {
          count: 3,
          keyword: 'acme'
        },
        {
          count: 2,
          keyword: 'drainage'
        },
        {
          count: 5,
          keyword: 'chopper'
        },
        {
          count: 1,
          keyword: 'erase'
        },
        {
          count: 1,
          keyword: 'payday'
        },
        {
          count: 3,
          keyword: 'tactics'
        }
      ]
    }
  }
}
