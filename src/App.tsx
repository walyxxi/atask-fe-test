import { useState } from "react";
import xMarkIcon from "./assets/icons/x-mark.svg";
import cevronDownIcon from "./assets/icons/cevron-down.svg";
import startIcon from "./assets/icons/star.svg";
import { DUMMY_USER_DATA } from "./assets/constant";
import { User, Repo } from "./model";

function App() {
  const [search, setSearch] = useState("");

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => setSearch("");

  return (
    <div className="mx-auto my-0 max-w-xl">
      <div className="w-full p-4 flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder={`Enter username`}
            className="w-full pl-3 pr-10 py-2 rounded-md bg-slate-100 border-2 border-blue-100 hover:border-blue-300 focus:border-blue-400 focus:outline-none"
            onChange={handleChangeSearch}
            value={search}
          />
          {search !== "" && (
            <img
              src={xMarkIcon}
              alt="_icon"
              className="absolute right-2 top-2 w-7 cursor-pointer"
              onClick={handleClearSearch}
            />
          )}
        </div>
        <button
          className="w-full py-2 rounded-md bg-blue-500 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
          disabled={!search}
        >
          Search
        </button>
        <div className="w-full flex flex-col">
          {DUMMY_USER_DATA.map((user: User) => (
            <div key={user.id}>
              <div className="w-full px-3 py-2 flex justify-between bg-slate-100 rounded-md border-2 border-slate-100 hover:border-blue-200">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt="_icon"
                    className="w-10 rounded-full cursor-pointer"
                  />
                  <span className="font-bold">{user.login}</span>
                </div>
                <img
                  src={cevronDownIcon}
                  alt="_icon"
                  className="w-6 cursor-pointer"
                />
              </div>
              <div className="mt-2 flex flex-col">
                {user?.repos_data?.map((repo: Repo) => (
                  <div
                    key={repo.id}
                    className="ml-6 px-3 py-2 flex flex-col mb-2 rounded-md bg-slate-300 border-2 border-slate-100 hover:border-blue-200"
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
                    <div>{repo.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
