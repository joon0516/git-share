/**
 * TODO:
 * Display a list of cards detailing every repository provided in the JSON file
 * There are two async steps here: 
 *  First retrieve the json from the server using a fetch
 *  Then retrieve the profile picture(s) of the user(s) that the repos belong to
 * Use react query library for this
 * 
 * Repository cards should link to a dynamic route (repos/repoName)
 * Somewhere in here we need to do error handling to make sure the links
 * provided are actually valid links. But TBH that doesn't really matter, the
 * user should be able to easily figure that out and the client should never see that
 * error if our user does
 * 
 */

interface RepoCardProps {
    name: string,
    profilePicture: ImageData // might be wrong type
}

function RepositoryCard() {
    return <> </>
}


function RepositoryListing() {
    return <> </>
}

export default RepositoryListing