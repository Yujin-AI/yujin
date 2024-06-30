import { ApplicationService } from '@adonisjs/core/types'
import Haikunator from 'haikunator'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    // @ts-ignore
    haikunator: Haikunator.default
  }
}

export default class HaikunatorProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    this.app.container.singleton('haikunator', () => {
      // @ts-ignore
      return new Haikunator({
        defaults: {
          delimiter: ' ',
          tokenLength: 2,
        },
      })
    })
  }
}
