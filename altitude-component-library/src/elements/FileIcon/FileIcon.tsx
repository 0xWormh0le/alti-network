import React, { useEffect, useState } from 'react'
import './FileIcon.scss'

export interface FileIconProps {
  mimeType: string
  iconUrl: string
}

const getFileIcon = (mimeType: string, iconUrl: string) => {
  if (iconUrl) {
    if (iconUrl.indexOf('vnd.google-apps.folder+shared') > -1) {
      return 'icon-small-shared-folder.svg'
    } else if (iconUrl.indexOf('vnd.google-apps.folder') > -1) {
      return 'icon-small-folder.svg'
    } else if (iconUrl.indexOf('')) return iconUrl
  }
  if (mimeType && mimeType.indexOf('image') !== -1) {
    return 'icon-small-img.png'
  } else if (mimeType === 'document') {
    return 'icon-small-doc.svg'
  } else if (mimeType === 'folder') {
    return 'icon-small-folder-black.svg'
  }
  return 'icon-small-file.png'
}

const FileIcon: React.FC<FileIconProps> = ({ mimeType, iconUrl }) => {
  const [fileIcon, setFileIcon] = useState<string>()
  const [imgFile, setImgFile] = useState<string>()
  useEffect(() => {
    setFileIcon(getFileIcon(mimeType, iconUrl))
  }, [mimeType, iconUrl])

  useEffect(() => {
    if (iconUrl && iconUrl.indexOf('vnd.google-apps.folder') === -1) {
      setImgFile(iconUrl)
    } else if (fileIcon) {
      import(`./icons/${fileIcon}`).then((img) => {
        setImgFile(img.default)
      })
    }
  }, [fileIcon, iconUrl])
  return (
    <div className='file_icon_container'>
      {imgFile && <img src={imgFile} alt={mimeType} title={mimeType} className='file_icon' />}
    </div>
  )
}

export default FileIcon
