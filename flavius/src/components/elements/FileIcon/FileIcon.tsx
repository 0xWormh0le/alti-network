import React, { useEffect, useState } from 'react'
import Tooltip from 'components/widgets/Tooltip'
import './FileIcon.scss'

export interface FileIconProps {
  mimeType: string
  iconUrl?: string
  className?: string
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

const getTooltipText = (str: string) => {
  if (!str) {
    return ''
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const FileIcon: React.FC<FileIconProps> = ({ mimeType, iconUrl, className }) => {
  const [fileIcon, setFileIcon] = useState<string>()
  const [imgFile, setImgFile] = useState<string>()
  const _className = className || 'file_icon'

  useEffect(() => {
    const newValue = getFileIcon(mimeType, iconUrl || '')
    if (newValue !== fileIcon) setFileIcon(newValue)
  }, [mimeType, iconUrl, fileIcon])

  useEffect(() => {
    if (iconUrl && iconUrl.indexOf('vnd.google-apps.folder') === -1) {
      setImgFile(iconUrl)
    } else if (fileIcon) {
      import(`icons/${fileIcon}`).then((img) => {
        setImgFile(img.default)
      })
    }
  }, [fileIcon, iconUrl])
  return (
    <div className='file_icon_container'>
      <Tooltip text={getTooltipText(mimeType)} id={mimeType}>
        <div>{imgFile && <img src={imgFile} alt={mimeType} className={_className} />}</div>
      </Tooltip>
    </div>
  )
}

export default FileIcon
