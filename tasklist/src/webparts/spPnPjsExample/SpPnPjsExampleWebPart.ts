import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpPnPjsExampleWebPartStrings';
import SpPnPjsExample from './components/SpPnPjsExample';
import { ISpPnPjsExampleProps } from './components/ISpPnPjsExampleProps';

export interface ISpPnPjsExampleWebPartProps {
  description: string;
}

export default class SpPnPjsExampleWebPart extends BaseClientSideWebPart<ISpPnPjsExampleWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISpPnPjsExampleProps > = React.createElement(
      SpPnPjsExample,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
