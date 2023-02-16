export const initialState = {
  dropdownData: [],
  imagesPath: [],
};

const profileReducer = (state = initialState, action) => {
  // console.log("actionaction", action);
  switch (action.type) {
    case 'SET_USER_COLLECTION_ITEMS': {
      const items = action.dropdownItems;
      // console.log(items, 'Reducer');
      return {
        ...state,
        dropdownData: items.reverse(),
      };
    }
    case 'SET_USER_POST': {
      const posts = action.posts;
      return {
        ...state,
        imagesPath: posts,
      };
    }
    case 'ADD_USER_COLLECTION_ITEM': {
      const newCollection = action.userCollectionItem;
      let oldUserCollections = state.dropdownData;

      oldUserCollections.pop();
      const newUserCollections = oldUserCollections.concat(newCollection, {
        label: 'Add +',
        value: -1,
      });

      return {
        ...state,
        dropdownData: newUserCollections.reverse(),
      };
    }

    default: {
      return state;
    }
  }
};

export default profileReducer;
