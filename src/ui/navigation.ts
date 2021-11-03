import { h } from '../core'
import { Component } from '../component'
import { boxShadow, userSelect, zIndex } from './_config'
import { Icon } from './icon'
import { getTheme } from './_config'

interface NavigationProps {
  parentId?: string
  children?: Component<any>[]
  onClick?: (e: { id: string; label: string; component: NavigationAction; navigate: boolean }) => void
}

interface ActionProps {
  id?: string
  label: string
  active?: boolean
  icon?: any
  link?: string
  onClick?: (e: { id: string; label: string; component: NavigationAction; navigate: boolean }) => void
}

const classes = {
  label: 'bottom_navigation_label',
  action: 'bottom_navigation_action',
  idPrefix: 'bottom_navigation_action_id-',
  inactive: 'bottom_navigation_action_inactive',
  initialActive: 'bottom_navigation_label_initial_active'
}

export class NavigationAction extends Component<ActionProps> {
  willMount() {
    this.id = this.props.id ?? this.props.label.toLowerCase().replace(/\s/gm, '-').replace(/[-]+/gm, '-')
  }

  render() {
    const label = h('span', { class: classes.label }, this.props.label)

    const actionClasses = [classes.action]
    if (this.props.active) actionClasses.push(classes.initialActive)
    else actionClasses.push(classes.inactive)

    const icon = this.props.icon ? h(Icon, { size: 22, style: 'margin-bottom: 2px;', src: this.props.icon }) : null
    const iconWrapper = h('div', { class: 'bottom_navigation_action-icon-wrapper' }, icon)

    return h(
      'div',
      {
        id: `${classes.idPrefix}${this.id}`,
        class: actionClasses.join(' '),
        onClick: () => {
          if (this.props.link) window.location.href = this.props.link
          this.props.onClick?.({ navigate: !!this.props.link, id: this.id, label: this.props.label, component: this })
        }
      },
      this.props.icon ? iconWrapper : null,
      label
    )
  }
}

export class Navigation extends Component<NavigationProps> {
  didMount() {
    const children = this.props.children as Component<ActionProps>[]

    children.forEach(c => {
      c.props.onClick = e => {
        if (e.navigate) return
        const elements = document.querySelectorAll(`[id^="${classes.idPrefix}"]`)
        elements.forEach(el => {
          if (el.id === `${classes.idPrefix}${e.id}`) el.classList.remove(classes.inactive)
          else el.classList.add(classes.inactive)
        })
        this.props.onClick?.(e)
      }
    })
  }

  render() {
    const {
      colors: { surface, onSurface, secondaryContainer }
    } = getTheme()

    const styles = `
      #bottom_navigation_container {

        background-color: ${surface};
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        min-height: 56px;

        z-index: ${zIndex.navigation}

        display: flex;
        justify-content: center;
        
        ${boxShadow}
      } 

      #bottom_navigation_container .bottom_navigation_label {
        transition: font-size 0.2s;
      }

      #bottom_navigation_container .bottom_navigation_label_initial_active .bottom_navigation_label{
        animation-name: bottom_navigation_label_fontsize;
        animation-duration: 0.2s;
      }

      @keyframes bottom_navigation_label_fontsize {
        from {font-size: 12px;}
        to {font-size: 14px;}
      }

      #bottom_navigation_container .bottom_navigation_action {
        color: ${onSurface};
        font-size: 14px;

        min-width: 80px;
        max-width: 168px;
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        ${userSelect}
      }

      #bottom_navigation_container .bottom_navigation_action .bottom_navigation_action-icon-wrapper {
        background-color:${secondaryContainer};
        padding: 2px 22px;
        border-radius: 16px;
      }

      #bottom_navigation_container .bottom_navigation_action_inactive {
        color: ${onSurface};
        font-size: 12px;
      }

      #bottom_navigation_container .bottom_navigation_action_inactive .bottom_navigation_action-icon-wrapper {
        background: transparent;
      }

      #bottom_navigation_container i {
        background-color: ${onSurface};
        position: relative;
        top: 2px;
      }
    `

    document.head.appendChild(h('style', {}, styles))

    const { parentId, children } = this.props

    const navigation = h('div', { id: 'bottom_navigation_container' }, children)

    if (parentId) {
      const parent = document.getElementById(parentId)
      if (parent) {
        parent.appendChild(navigation)
        return
      }
    }

    return navigation
  }
}
