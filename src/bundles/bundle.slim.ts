// core
import { h, render, hydrate, tick } from '../core'
import { hydrateLazy } from '../lazy'

// useful tools
import { Component } from '../component'
import { Fragment } from '../fragment'
import { Store } from '../store'
import { createContext } from '../context'

// tagged templates
import { jsx } from '../jsx'

export default {
  createContext,
  h,
  hydrate,
  hydrateLazy,
  jsx,
  render,
  tick,
  Component,
  Fragment,
  Store,
}