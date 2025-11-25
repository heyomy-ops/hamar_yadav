import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import NodeCard from './NodeCard';

const TreeNode = ({ node, onTagClick, isAdminMode, highlightedId }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <NodeCard 
        node={node} 
        isExpanded={expanded} 
        toggleExpand={() => setExpanded(!expanded)}
        hasChildren={hasChildren} 
        onTagClick={onTagClick}
        isAdminMode={isAdminMode}
        isHighlighted={highlightedId === node.id}
      />

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            {/* 1. Main Trunk Down */}
            <div className="w-0.5 h-8 bg-slate-300 relative">
               <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
            </div>

            {/* 2. Branch Container */}
            <div className="flex items-start justify-center relative">
              
              {node.children.map((child, index) => {
                 const isFirst = index === 0;
                 const isLast = index === node.children.length - 1;
                 const isSingle = node.children.length === 1;

                 return (
                    <div key={child.id} className="flex flex-col items-center relative px-6">
                        {/* Top Connector Lines (The "Elbows") */}
                        {!isSingle && (
                          <>
                            {/* Line extending to the Right */}
                            {!isLast && (
                              <div className="absolute top-0 right-0 w-[50%] h-0.5 bg-slate-300"></div>
                            )}
                            {/* Line extending to the Left */}
                            {!isFirst && (
                              <div className="absolute top-0 left-0 w-[50%] h-0.5 bg-slate-300"></div>
                            )}
                            {/* Rounded corners */}
                            {isFirst && <div className="absolute top-0 right-0 w-[50%] h-4 border-t-2 border-l-2 border-slate-300 rounded-tl-2xl -translate-y-[2px]"></div>}
                            {isLast && <div className="absolute top-0 left-0 w-[50%] h-4 border-t-2 border-r-2 border-slate-300 rounded-tr-2xl -translate-y-[2px]"></div>}
                          </>
                        )}

                        {/* Vertical Drop to Child */}
                        <div className={`w-0.5 h-8 bg-slate-300 ${!isSingle && (isFirst || isLast) ? '' : 'origin-top'}`}>
                           {/* Middle nodes connector */}
                           {!isSingle && !isFirst && !isLast && (
                             <div className="absolute -top-4 left-1/2 -translate-x-[1px] w-0.5 h-4 bg-slate-300"></div>
                           )}
                           
                           {/* Connection Dot at horizontal intersection */}
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        </div>

                        <TreeNode node={child} onTagClick={onTagClick} isAdminMode={isAdminMode} highlightedId={highlightedId} />
                    </div>
                 );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreeNode;
