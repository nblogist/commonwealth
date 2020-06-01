import 'components/autocomplete_tag_form.scss';

import { default as m } from 'mithril';
import { SelectList, ListItem, Colors, Button, Icons, List } from 'construct-ui';
import { OffchainTag } from 'client/scripts/models';


interface IAutoCompleteTagFormAttrs {
  defaultActiveIndex?: number;
  tags: OffchainTag[];
  featuredTags: OffchainTag[];
  tabindex?: number;
  updateFormData: Function;
  updateParentErrors?: Function;
}

interface IAutoCompleteTagFormState {
  error: string;
  selectedTag: OffchainTag | string;
}

const AutoCompleteTagForm: m.Component<IAutoCompleteTagFormAttrs, IAutoCompleteTagFormState> = {
  view: (vnode) => {
    const { featuredTags, tags, updateFormData } = vnode.attrs;

    const itemRender = (tag) => {
      return m(ListItem, {
        class: featuredTags.includes(tag) ? 'featured-tag' : 'other-tag',
        contentLeft: m('.tagItem', `# ${tag.name}`),
        selected: vnode.state.selectedTag && (vnode.state.selectedTag as OffchainTag).name === tag.name,
      });
    };

    const itemPredicate = (query: string, item: OffchainTag) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    };

    const onSelect = (item: OffchainTag) => {
      vnode.state.selectedTag = item;
      updateFormData(item);
    };

    const manuallyClosePopover = () => {
      const button = document.getElementsByClassName('tag-selection-drop-menu')[0];
      if (button) (button as HTMLButtonElement).click();
    };

    const addTag = (tag: string) => {
      vnode.state.selectedTag = tag;
      updateFormData(tag);
      manuallyClosePopover();
    };

    const sortTags = (tags_: OffchainTag[]) => {
      return tags_.filter((tag) => featuredTags.includes(tag)).sort((a, b) => a.name > b.name ? 1 : -1)
        .concat(tags_.filter((tag) => !featuredTags.includes(tag)).sort((a, b) => a.name > b.name ? 1 : -1));
    };

    const EmptyContent: m.Component<{}, {}> = {
      view: (vnode_) => {
        const input = (document.getElementsByClassName('autocomplete-tag-input')[0] as HTMLInputElement);
        const query = input.innerText;
        return m('a.no-matching-tags', {
          href: '#',
          onclick: () => addTag(query),
        }, 'No matches found. Add tag?');
      }
    };

    return m(SelectList, {
      class: 'AutocompleteTagForm',
      emptyContent: m(EmptyContent),
      inputAttrs: { class: 'autocomplete-tag-input' },
      itemPredicate,
      itemRender,
      items: sortTags(tags),
      onSelect,
      trigger: m(Button, {
        align: 'left',
        class: 'tag-selection-drop-menu',
        compact: true,
        iconRight: Icons.CHEVRON_DOWN,
        sublabel: 'Category',
        label: vnode.state.selectedTag
          ? ((vnode.state.selectedTag as OffchainTag).name || (vnode.state.selectedTag as string))
          : '',
      })
    });
  },
};

export default AutoCompleteTagForm;
