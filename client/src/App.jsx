import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Loader, NavigateRoute, Layout } from "./components";
import Error from "./pages/Error";
import AdminPanel from "./pages/AdminPanel";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/slices/userSlice";
import { toast } from "react-toastify";
import { PrivateResetRoute } from "./components/PrivateResetRoute";

const Signin = lazy(() => import("./pages/Singin"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home/Home"));
const AdminDash = lazy(() => import("./pages/AdminDash"));
const AllSongs = lazy(() => import("./pages/AllSongs"));
const AllPlaylists = lazy(() => import("./pages/AllPlaylists"));
const AddSongs = lazy(() => import("./pages/AddSongs"));
const CreatePlaylist = lazy(() => import("./pages/CreatePlaylist"));
const AllUsers = lazy(() => import("./pages/AllUsers"));
const AllArtists = lazy(() => import("./pages/AllArtists"));
const AddArtist = lazy(() => import("./pages/AddArtist"));
const ArtistPlaylist = lazy(() => import("./pages/ArtistPlaylist"));
const Artist = lazy(() => import("./pages/ArtistPage/Artist"));
const PlaylistPage = lazy(() => import("./pages/PlaylistPage"));
const LikedSongs = lazy(() => import("./pages/LikedSongs"));
const EditSong = lazy(() => import("./pages/EditSong"));
const EditArtist = lazy(()=>import ('./pages/EditArtist'));
const EditPlaylist = lazy(()=>import('./pages/EditPlaylist'));
const ForgotPassword = lazy(()=>import('./pages/ForgotPassword'));
const ResetPasswrod = lazy(()=>import('./pages/ResetPassword'));
const ForgotSuccess = lazy(()=>import('./pages/ForgotSuccess'))
const ResetSuccess = lazy(()=>import('./pages/ResetSuccess'))

export default function App() {

  const dispatch = useDispatch();
  const userState = useSelector(state => state.user)

  const checkLogin = async() =>{
    try {
      const response = await axios.get('/api/auth/verify-token');
    if(response.status !== 200){
      dispatch(logout());
    }
    } catch (error) {
      toast.error(error);
      dispatch(logout());
    }
  }
  
  useEffect(()=>{
    if(userState.isLoggedIn){
      checkLogin();
    }
  },[userState])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          }
        />

        <Route
          path="/artist/:artistId"
          element={
            <Suspense fallback={<Loader />}>
              <ArtistPlaylist />
            </Suspense>
          }
        />

        <Route
          path="/playlist/:playlistId"
          element={
            <Suspense fallback={<Loader />}>
              <PlaylistPage />
            </Suspense>
          }
        />
        <Route
          path="/artist"
          element={
            <Suspense fallback={<Loader />}>
              <Artist />
            </Suspense>
          }
        />
        <Route
          path="/liked-songs"
          element={
            <Suspense fallback={<Loader />}>
              <LikedSongs />
            </Suspense>
          }
        />
      </Route>

      {/* Admin Panel routes */}
      <Route path="/admin" element={<NavigateRoute />}>
        <Route element={<AdminPanel />}>
          <Route
            index
            element={
              <Suspense fallback={<Loader />}>
                <AdminDash />
              </Suspense>
            }
          />
          <Route
            path="songs"
            element={
              <Suspense fallback={<Loader />}>
                <AllSongs />
              </Suspense>
            }
          />
          <Route
            path="playlists"
            element={
              <Suspense fallback={<Loader />}>
                <AllPlaylists />
              </Suspense>
            }
          />
          <Route
            path="add-song"
            element={
              <Suspense fallback={<Loader />}>
                <AddSongs />
              </Suspense>
            }
          />
          <Route
            path="create-playlist"
            element={
              <Suspense fallback={<Loader />}>
                <CreatePlaylist />
              </Suspense>
            }
          />
          <Route
            path="artists"
            element={
              <Suspense fallback={<Loader />}>
                <AllArtists />
              </Suspense>
            }
          />
          <Route
            path="add-artist"
            element={
              <Suspense fallback={<Loader />}>
                <AddArtist />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<Loader />}>
                <AllUsers />
              </Suspense>
            }
          />
          <Route
              path="update-song/:songId"
              element={
                <Suspense fallback={<Loader />}>
                  <EditSong />
                </Suspense>
              }
            />
          <Route
              path="update-artist/:artistId"
              element={
                <Suspense fallback={<Loader />}>
                  <EditArtist />
                </Suspense>
              }
            />
          <Route
              path="update-playlist/:playlistId"
              element={
                <Suspense fallback={<Loader />}>
                  <EditPlaylist />
                </Suspense>
              }
            />
        </Route>
      </Route>

      {/* Authentication routes */}
      <Route
        path="/signin"
        element={
          <Suspense fallback={<Loader />}>
            <Signin />
          </Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<Loader />}>
            <Signup />
          </Suspense>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Suspense fallback={<Loader />}>
            <ForgotPassword />
          </Suspense>
        }
      />
      <Route
        path="/forgot-password/success"
        element={
          <Suspense fallback={<Loader />}>
            <PrivateResetRoute>
      <ForgotSuccess />
    </PrivateResetRoute>
          </Suspense>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <Suspense fallback={<Loader />}>
            <ResetPasswrod />
          </Suspense>
        }
      />
      <Route
        path="/reset-password/success"
        element={
          <Suspense fallback={<Loader />}>
            <PrivateResetRoute>
      <ResetSuccess />
    </PrivateResetRoute>
          </Suspense>
        }
      />

      <Route
        path="*"
        element={
          <Suspense fallback={<Loader />}>
            <Error />
          </Suspense>
        }
      />
    </Routes>
  );
}
