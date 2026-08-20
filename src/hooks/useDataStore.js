import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const emptyWeek = () => {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return Object.fromEntries(
    DAYS.map((d) => [d, { energy: 'medium', outcome: '', task2: '', task3: '', canWait: '', win: '', done: false }])
  )
}

const defaultData = { tasks: [], week: emptyWeek(), goals: [], todayEnergy: 'medium', todayWin: '' }

export function useDataStore() {
  const { user } = useAuth()
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)
  const loaded = useRef(false)

  // Load data — from Supabase if logged in, otherwise localStorage
  useEffect(() => {
    loaded.current = false
    setLoading(true)

    const load = async () => {
      if (user) {
        const { data: row, error } = await supabase
          .from('gsd_data')
          .select('data')
          .eq('user_id', user.id)
          .maybeSingle()

        if (row?.data) {
          setData({ ...defaultData, ...row.data, week: { ...emptyWeek(), ...(row.data.week || {}) } })
        } else {
          // first login — seed from any existing local data, or start fresh
          const local = localStorage.getItem('gsd-data')
          setData(local ? JSON.parse(local) : defaultData)
        }
      } else {
        const local = localStorage.getItem('gsd-data')
        if (local) {
          setData({ ...defaultData, ...JSON.parse(local) })
        } else {
          setData(defaultData)
        }
      }
      loaded.current = true
      setLoading(false)
    }

    load()
  }, [user])

  // Save data — debounced, to Supabase or localStorage depending on login state
  useEffect(() => {
    if (!loaded.current) return

    const t = setTimeout(async () => {
      if (user) {
        await supabase.from('gsd_data').upsert(
          { user_id: user.id, data, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
      } else {
        localStorage.setItem('gsd-data', JSON.stringify(data))
      }
    }, 500)

    return () => clearTimeout(t)
  }, [data, user])

  return [data, setData, loading]
}