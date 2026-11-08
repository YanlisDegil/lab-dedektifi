import { motion } from 'framer-motion'
import { GiMicroscope } from 'react-icons/gi'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-chemistry flex items-center justify-center"
        >
          <GiMicroscope className="text-white text-2xl" />
        </motion.div>
        <p className="text-dark-400 text-sm font-medium">Laboratuvar Hazırlanıyor...</p>
        <div className="mt-4 w-48 h-1 bg-dark-800 rounded-full overflow-hidden mx-auto">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-primary-500 to-chemistry rounded-full"
          />
        </div>
      </motion.div>
    </div>
  )
}
