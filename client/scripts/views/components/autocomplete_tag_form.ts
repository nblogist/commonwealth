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
    const { featuredTags, tabindex, tags, updateFormData } = vnode.attrs;

    const itemRender = (tag) => {
      return m(ListItem, {
        class: featuredTags.includes(tag) ? 'featured-tag' : 'other-tag',
        // contentLeft: m('.tagItem', `# ${tag.name}`),
        label: `# ${tag.name}`,
        selected: (vnode.state.selectedTag as OffchainTag)?.name === tag.name,
      });
    };

    const itemPredicate = (query: string, item: OffchainTag) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    };

    const onSelect = (item: OffchainTag) => {
      vnode.state.selectedTag = item;
      updateFormData(item.name, item.id);
    };

    const manuallyClosePopover = () => {
      const button = document.getElementsByClassName('tag-selection-drop-menu')[0];
      if (button) (button as HTMLButtonElement).click();
    };

    const addTag = () => {
      debugger
      const input = (document.getElementsByClassName('autocomplete-tag-input')[0].firstChild as HTMLInputElement);
      const newTag = input.value;
      tags.push({ name: newTag, id: undefined, description: '' });
      setTimeout(() => { vnode.state.selectedTag = newTag; }, 1);
      updateFormData(newTag);
      manuallyClosePopover();
    };

    const sortTags = (tags_: OffchainTag[]) => {
      return tags_.filter((tag) => featuredTags.includes(tag)).sort((a, b) => a.name > b.name ? 1 : -1)
        .concat(tags_.filter((tag) => !featuredTags.includes(tag)).sort((a, b) => a.name > b.name ? 1 : -1));
    };

    const EmptyContent: m.Component<{}, {}> = {
      view: (vnode_) => {
        return m('a.no-matching-tags', {
          href: '#',
          onkeyup: (e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              (document.querySelector('a.no-matching-tags') as HTMLLinkElement).click();
            }
          },
          onclick: () => addTag(),
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
        label: vnode.state.selectedTag
          ? ((vnode.state.selectedTag as OffchainTag).name || (vnode.state.selectedTag as string))
          : '',
        sublabel: 'Category',
        tabindex
      })
    });
  },
};

export default AutoCompleteTagForm;
