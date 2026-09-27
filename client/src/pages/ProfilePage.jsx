import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Camera, Save, Lock, Settings as SettingsIcon, Palette, Volume2, Type } from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '../components/layout/MainLayout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { userService } from '../services/apiServices'
import { wpmColor, accuracyColor, formatDuration, formatNumber } from '../utils/typingUtils'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const { theme, changeTheme, themes } = useTheme()

  const [tab, setTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [prefs, setPrefs] = useState(user?.preferences || {
    soundEnabled: false, showLiveWpm: true, showAccuracy: true,
    showTimer: true, smoothAnimations: true, fontSize: 'medium',
  })

  const handleProfileSave = async () => {
    setSavingProfile(true)
    try {
      const { user: updated } = await userService.updateProfile(profileForm)
      updateUser(updated)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSavingPw(true)
    try {
      await userService.changePassword(pwForm.currentPassword, pwForm.newPassword)
      toast.success('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingPw(false)
    }
  }

  const handlePreferenceChange = async (key, value) => {
    const updated = { ...prefs, [key]: value }
    setPrefs(updated)
    if (key === 'theme') changeTheme(value)
    try {
      await userService.updatePreferences(updated)
      updateUser({ preferences: updated })
    } catch {
      // silent fail
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={15} /> },
    { id: 'security', label: 'Security', icon: <Lock size={15} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={15} /> },
  ]

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="card mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-forge-500 to-forge-700 flex items-center justify-center text-white text-3xl font-black shadow-glow-orange">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera size={20} className="text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-dark-400 text-sm">@{user?.username}</p>
            {user?.bio && <p className="text-dark-300 text-sm mt-1">{user.bio}</p>}
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs text-dark-500">Joined {new Date(user?.createdAt).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</span>
              {user?.currentStreak > 0 && <span className="text-xs text-orange-400">🔥 {user.currentStreak} day streak</span>}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-xl font-black ${wpmColor(user?.bestWpm || 0)}`}>{user?.bestWpm || 0}</p>
              <p className="text-xs text-dark-500">Best WPM</p>
            </div>
            <div>
              <p className={`text-xl font-black ${accuracyColor(user?.bestAccuracy || 0)}`}>{user?.bestAccuracy || 0}%</p>
              <p className="text-xs text-dark-500">Best Acc</p>
            </div>
            <div>
              <p className="text-xl font-black text-white">{formatNumber(user?.totalTests || 0)}</p>
              <p className="text-xs text-dark-500">Tests</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-800 rounded-xl p-1 w-fit mb-8">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-forge-500 text-white' : 'text-dark-400 hover:text-white'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-5">
            <h2 className="font-semibold text-white">Edit Profile</h2>
            <div>
              <label className="label">Display Name</label>
              <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="label">Username</label>
              <input value={user?.username} disabled className="input opacity-50 cursor-not-allowed" />
              <p className="text-xs text-dark-500 mt-1">Username cannot be changed</p>
            </div>
            <div>
              <label className="label">Email</label>
              <input value={user?.email} disabled className="input opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                className="input resize-none" rows={3} placeholder="Tell us about yourself..." maxLength={200} />
              <p className="text-xs text-dark-500 mt-1">{profileForm.bio.length}/200</p>
            </div>
            <button onClick={handleProfileSave} disabled={savingProfile} className="btn btn-primary disabled:opacity-60">
              {savingProfile ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} /> Save Changes</>}
            </button>
          </motion.div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-5">
            <h2 className="font-semibold text-white">Change Password</h2>
            {[
              { label: 'Current Password', key: 'currentPassword', placeholder: '••••••••' },
              { label: 'New Password', key: 'newPassword', placeholder: '••••••••' },
              { label: 'Confirm New Password', key: 'confirmPassword', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input type="password" value={pwForm[f.key]}
                  onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="input" placeholder={f.placeholder} />
              </div>
            ))}
            <button onClick={handlePasswordChange} disabled={savingPw} className="btn btn-primary disabled:opacity-60">
              {savingPw ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Update Password'}
            </button>
          </motion.div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Theme */}
            <div className="card">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><Palette size={16} /> Theme</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(themes).map(([key, t]) => (
                  <button key={key} onClick={() => handlePreferenceChange('theme', key)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${theme === key ? 'border-forge-500 bg-forge-500/10 text-forge-400' : 'border-dark-700 text-dark-400 hover:border-dark-500'}`}>
                    <div className="w-full h-8 rounded-lg mb-2 border border-dark-600" style={{ backgroundColor: t.bg }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound */}
            <div className="card">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><Volume2 size={16} /> Sound</h3>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-white">Typing Sounds</p>
                  <p className="text-xs text-dark-500">Play subtle sounds while typing</p>
                </div>
                <div
                  onClick={() => handlePreferenceChange('soundEnabled', !prefs.soundEnabled)}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${prefs.soundEnabled ? 'bg-forge-500' : 'bg-dark-700'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${prefs.soundEnabled ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>

            {/* Font size */}
            <div className="card">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><Type size={16} /> Display</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Font Size</label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large', 'xlarge'].map(size => (
                      <button key={size} onClick={() => handlePreferenceChange('fontSize', size)}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${prefs.fontSize === size ? 'bg-forge-500 text-white' : 'bg-dark-700 text-dark-400 hover:text-white'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  { key: 'showLiveWpm', label: 'Show Live WPM', desc: 'Display WPM counter during typing' },
                  { key: 'showAccuracy', label: 'Show Accuracy', desc: 'Display accuracy during typing' },
                  { key: 'showTimer', label: 'Show Timer', desc: 'Display countdown/elapsed time' },
                  { key: 'smoothAnimations', label: 'Smooth Animations', desc: 'Enable UI animations' },
                ].map(s => (
                  <label key={s.key} className="flex items-center justify-between cursor-pointer py-1">
                    <div>
                      <p className="text-sm font-medium text-white">{s.label}</p>
                      <p className="text-xs text-dark-500">{s.desc}</p>
                    </div>
                    <div onClick={() => handlePreferenceChange(s.key, !prefs[s.key])}
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${prefs[s.key] ? 'bg-forge-500' : 'bg-dark-700'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${prefs[s.key] ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  )
}

export default ProfilePage
