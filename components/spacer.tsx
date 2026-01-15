import React from 'react'
import { View } from 'react-native'

type SpacerProps = {
  height?: number
  width?: number | `${number}%`
}

const Spacer = ({ height = 40, width = "100%" }: SpacerProps) => {
  return <View style={{ height, width }} />
}

export default Spacer



