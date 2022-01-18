/* eslint-disable prefer-const */
export { Fragment } from '../fragment'
import { h } from '../core'

const createNode: (type: any, props: any, key: string, source?: string, self?: string) => any = function (type, props) {
  let { children = [], ..._props } = props
  if (!Array.isArray(children)) children = [children]
  return h(type, _props, ...children)
}

export { createNode as jsx }
export { createNode as jsxs }
export { createNode as jsxDev }
