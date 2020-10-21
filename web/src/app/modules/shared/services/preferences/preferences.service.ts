/*
 * Copyright (c) 2020 the Octant contributors. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '../../models/preference';
import { ThemeService } from '../theme/theme.service';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  public preferencesOpened: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  public navCollapsed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private themeService: ThemeService) {}

  public preferencesChanged(update: any) {
    const collapsed = update['general.navigation'] === 'collapsed';
    const isLightTheme = update['general.theme'] === 'light';

    if (this.navCollapsed.value !== collapsed) {
      this.navCollapsed.next(collapsed);
    }

    if (this.themeService.isLightThemeEnabled() !== isLightTheme) {
      this.themeService.switchTheme();
    }
  }

  // TODO move to better place and merge with server side prefs.
  public getPreferences(): Preferences {
    return {
      updateName: 'generalPreferences',
      panels: [
        {
          name: 'General',
          sections: [
            {
              name: 'Color Theme',
              elements: [
                {
                  name: 'general.theme',
                  type: 'radio',
                  value: this.themeService.isLightThemeEnabled()
                    ? 'light'
                    : 'dark',
                  config: {
                    values: [
                      {
                        label: 'Dark',
                        value: 'dark',
                      },
                      {
                        label: 'Light',
                        value: 'light',
                      },
                    ],
                  },
                },
              ],
            },
            {
              name: 'Navigation',
              elements: [
                {
                  name: 'general.navigation',
                  type: 'radio',
                  value: this.navCollapsed.value ? 'collapsed' : 'expanded',
                  config: {
                    values: [
                      {
                        label: 'Expanded',
                        value: 'expanded',
                      },
                      {
                        label: 'Collapsed',
                        value: 'collapsed',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }
}
