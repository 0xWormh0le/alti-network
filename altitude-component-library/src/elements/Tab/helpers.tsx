export const getTabIndexOf = (element: HTMLElement) => {
  const tabs = [].slice
    .call(element?.parentNode?.children)
    .filter((e: HTMLElement) => e.getAttribute('aria-roledescription') === 'tab') as HTMLElement[]
  return tabs.indexOf(element)
}

export const getTabPanelIndexOf = (element: HTMLElement) => {
  const tabPanels = [].slice
    .call(element?.parentNode?.children)
    .filter((e: HTMLElement) => e.getAttribute('aria-roledescription') === 'tabPanel') as HTMLElement[]
  return tabPanels.indexOf(element)
}
