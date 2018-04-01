//Return pics from an user
export const getImagesByUserID = (userID, amount) => {
  return fetch(`https://instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":"${userID}","first":"${amount}","after":null}`)
    .then(res => res.json())
    .then(json => {
      return json.data.user.edge_owner_to_timeline_media.edges
        .map(node => {
          return {
            id: node.node.id,
            src: node.node.display_url,
            resources: node.node.thumbnail_resources,
            comments_count: node.node.edge_media_to_comment.count,
            likes_count: node.node.edge_media_preview_like.count,
            shortcode: node.node.shortcode
          }
        }).sort((a, b) => b.likes_count - a.likes_count)
    });
};
//Return a user with its basic info
export const getUserByUserName = (userName) => {
  return fetch(`https://www.instagram.com/${userName}/?__a=1`)
    .then(res => {
      if (res.ok)
        return res.json();
      else
        throw new Error('Network response was not ok, maybe a 404');
    })
    .then(json => json.graphql.user)
};
//Return a complete user and 50 pics within it
export const getUser = async (userName) => {
  try {
    const user = await getUserByUserName(userName);
    const userImages = await getImagesByUserID(user.id, 50);
    return {
      username: user.username,
      full_name: user.full_name,
      images: userImages,
      id: user.id,
    }
  }
  catch (err) {
    console.log(err);
    return null;
  }
};

//Experimental, get list of usernames : https://www.instagram.com/web/search/topsearch/?context=blended&query=m
export const getUserList = async (userName) => {
  return await fetch(`https://www.instagram.com/web/search/topsearch/?context=blended&query=${userName}`)
    .then(res => res.json())
    .then(json => json.users.map(c => {
      return {
        id: c.user.pk,
        username: c.user.username,
        full_name: c.user.full_name,
        profile_pic_url: c.user.profile_pic_url
      }
    }));
};
