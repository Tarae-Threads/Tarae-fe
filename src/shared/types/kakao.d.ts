interface DaumPostcodeData {
  zonecode: string
  address: string
  roadAddress: string
  jibunAddress: string
  buildingName: string
  apartment: string
  sido: string
  sigungu: string
  bname: string
  userSelectedType: 'R' | 'J'
}

interface DaumPostcodeOptions {
  oncomplete: (data: DaumPostcodeData) => void
  width?: string | number
  height?: string | number
}

interface DaumPostcodeInstance {
  open: () => void
  embed: (element: HTMLElement) => void
}

interface DaumPostcodeConstructor {
  new (options: DaumPostcodeOptions): DaumPostcodeInstance
}

interface Window {
  daum?: {
    Postcode: DaumPostcodeConstructor
  }
}
