import axios from "axios";
import { useCallback, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cevronDownIcon from "./assets/icons/cevron-down.svg";
import cevronUpIcon from "./assets/icons/cevron-up.svg";
import startIcon from "./assets/icons/star.svg";
import xMarkIcon from "./assets/icons/x-mark.svg";
import RepoSkaleton from "./components/RepoSkaleton";
import UserSkaleton from "./components/UserSkaleton";
import { githubApiDomain, githubApiKey } from "./constant";
import { Repo, User, Users } from "./model";
import { apiErrorHandler, toastOptions } from "./utils/api";

function App() {
  const [users, setUsers] = useState<Users>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const handleClearUsers = () => setUsers([]);
  const handleClearSearch = () => setUsername("");

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (e.target.value === "") handleClearUsers();
  };

  const handleKeyDownToogleUser = (
    e: React.KeyboardEvent<HTMLDivElement>,
    user: User
  ) => {
    if (e.key === "Enter") handleToggleUser(user);
  };

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios(
        `${githubApiDomain}/search/users?q=${username}&page=0&per_page=10`,
        {
          headers: {
            Authorization: "Bearer " + githubApiKey,
          },
        }
      );

      if (response.data.items.length < 1)
        toast.info("No user found!", toastOptions);

      setUsers(
        response.data.items.map((item: User) => ({
          id: item.id,
          login: item.login,
          avatar_url: item.avatar_url,
          repos_url: item.repos_url,
          repos_data: [],
          repos_open: false,
          repos_loading: false,
          is_repos_fetched: false,
        }))
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        apiErrorHandler({
          message: err.response?.data?.message,
          status: err.response?.status || 500,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleToggleUser = useCallback(async (user: User) => {
    setUsers((curr) =>
      curr.map((item) => {
        if (item.id === user.id) {
          return {
            ...item,
            repos_open: !item.repos_open,
            repos_loading:
              !item.repos_open && !item.is_repos_fetched ? true : false,
          };
        } else {
          return item;
        }
      })
    );

    if (!user.repos_open && !user.is_repos_fetched) {
      try {
        const response = await axios(user.repos_url);

        setUsers((curr) =>
          curr.map((item) => {
            if (item.id === user.id) {
              return {
                ...item,
                repos_data: response.data,
                repos_loading: false,
                is_repos_fetched: true,
              };
            } else {
              return item;
            }
          })
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          apiErrorHandler({
            message: err.response?.data?.message,
            status: err.response?.status || 500,
          });
        }
      }
    }
  }, []);

  return (
    <div className="mx-auto my-0 max-w-xl">
      <div className="relative w-full">
        <div className="sticky top-0 p-4 bg-white flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder={`Enter username`}
              className="w-full pl-3 pr-10 py-2 rounded-md bg-slate-100 border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400 focus:outline-none"
              onChange={handleChangeUsername}
              value={username}
            />
            {username !== "" && (
              <img
                src={xMarkIcon}
                alt="_icon"
                className="absolute right-2 top-2 w-7 cursor-pointer"
                onClick={handleClearSearch}
              />
            )}
          </div>
          <button
            className="w-full py-2 rounded-md bg-blue-500 text-white disabled:bg-slate-300 disabled:cursor-not-allowed focus:outline-blue-600"
            disabled={!username}
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <div className="w-full flex flex-col select-none overflow-auto px-4 py-2">
          {loading ? (
            <UserSkaleton />
          ) : (
            <>
              {users.map((user: User) => (
                <div key={user.id} className="mb-2">
                  <div
                    tabIndex={0}
                    className="px-3 py-2 flex justify-between bg-slate-100 rounded-md border-2 border-slate-100 hover:border-blue-200 focus:outline-blue-400 cursor-pointer"
                    onClick={() => handleToggleUser(user)}
                    onKeyDown={(e) => handleKeyDownToogleUser(e, user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10">
                        <img
                          src={user.avatar_url}
                          alt="_icon"
                          className="w-full h-full rounded-full cursor-pointer"
                          loading="lazy"
                        />
                      </div>
                      <span className="font-bold">{user.login}</span>
                    </div>
                    <img
                      src={user.repos_open ? cevronUpIcon : cevronDownIcon}
                      alt="_icon"
                      className="w-6 cursor-pointer"
                    />
                  </div>
                  {user.repos_open && (
                    <div className="ml-6 mt-2 flex flex-col gap-2">
                      {user.is_repos_fetched && user.repos_data.length < 1 && (
                        <div className="px-3 py-2 rounded-md bg-slate-300 text-center">
                          No Repositories
                        </div>
                      )}
                      {user.repos_loading && <RepoSkaleton />}
                      {!user.repos_loading &&
                        user.repos_data?.map((repo: Repo) => (
                          <a
                            key={repo.id}
                            className="px-3 py-2 flex flex-col rounded-md bg-slate-300 focus:outline-slate-400 cursor-pointer"
                            href={repo.html_url}
                            target="_blank"
                          >
                            <div className="flex justify-between">
                              <div className="font-bold">{repo.name}</div>
                              <div className="flex gap-1">
                                <span>{repo.stargazers_count}</span>
                                <img
                                  src={startIcon}
                                  alt="_icon"
                                  className="w-4 cursor-pointer"
                                />
                              </div>
                            </div>
                            <div className="whitespace-pre-wrap break-words">
                              {repo.description}
                            </div>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
